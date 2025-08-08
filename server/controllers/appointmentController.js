const db = require("../config/db");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const generateAppointmentPDF = require("../utils/generateAppointmentDetails")
// Patient side
const createAppointment = async (req, res) => {
  try {
    // 1. Authenticate the patient
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patientId = decoded.id;

    // 2. Extract appointment details
    const {
      doctorId,
      timeSlot, // incoming as ISO string (UTC)
      department,
      symptoms,
      consultationType,
    } = req.body;

    console.log(" Incoming timeSlot (UTC):", timeSlot);
    console.log(req.body);

    const formattedTimeSlot = new Date(timeSlot);

    // 3. Check if the exact time slot is available
    const [slotRows] = await db.execute(
      `SELECT id, start_time FROM timeslots 
       WHERE doctor_id = ? 
       AND start_time = ? 
       AND is_available = 1`,
      [doctorId, formattedTimeSlot]
    );

    const slot = slotRows[0];
    console.log("Matching slot row:", slot);

    if (!slot) {
      return res.status(400).json({
        message: "Selected time slot is no longer available.",
      });
    }

    const { id: slotId, start_time } = slot;

    // 4. Prevent multiple appointments on the same day
    const [sameDayAppointments] = await db.execute(
      `SELECT id FROM appointments
       WHERE patient_id = ? AND DATE(appointment_time) = DATE(?)`,
      [patientId, start_time]
    );

    if (sameDayAppointments.length > 3) {
      console.log("Blocked: Same day appointment exists");
      return res.status(400).json({
        message: "You already have an appointment booked on this day.",
      });
    }

    // 5. Prevent duplicate appointments at same time
    const [conflicts] = await db.execute(
      `SELECT id FROM appointments 
       WHERE patient_id = ? 
       AND appointment_time = ? 
       AND status IN ('pending', 'confirmed')`,
      [patientId, start_time]
    );

    if (conflicts.length > 0) {
      console.log("Blocked: Duplicate appointment at same time");
      return res.status(400).json({
        message: "You already have another appointment booked at this time.",
      });
    }

    // 6. Insert appointment
    const [insertResult] = await db.execute(
      `INSERT INTO appointments (
         patient_id,
         doctor_id,
         time_slot_id,
         appointment_time,
         status,
         consultation_mode,
         payment_status,
         department,
         symptoms
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        doctorId,
        slotId,
        start_time,
        "pending",
        consultationType,
        "unpaid",
        department,
        symptoms || null,
      ]
    );
    console.log("Insert result:", insertResult);

    // 7. Mark the slot as unavailable
    const [updateResult] = await db.execute(
      `UPDATE timeslots SET is_available = 0 WHERE id = ?`,
      [slotId]
    );
    console.log("Update result:", updateResult);

    return res.status(201).json({
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
const getAppointments = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  // console.log("Let get userID and Role:", userId);
  // console.log("Let get userID and Role:", role);

  try {
    let query = "";
    let values = [];

    if (role === "doctor") {
      const [[doctorRow]] = await db.execute(
        `SELECT id FROM doctors WHERE user_id = ?`,
        [userId]
      );
      if (!doctorRow)
        return res.status(404).json({ message: "Doctor not found" });

      const doctorId = doctorRow.id;
      query = `
      SELECT 
          a.*, 
          pu.name AS patient_name, 
          pu.avatar AS patient_avatar, 
          pu.online AS patient_online,
          du.name AS doctor_name,
          du.avatar AS doctor_avatar,
          du.online AS doctor_online
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        WHERE a.doctor_id = ? AND a.status IN ('pending', 'cancelled')
        ORDER BY a.appointment_time DESC
       `;
      values = [doctorId];
    } else if (role === "patient") {
      // First: auto-update expired pending/confirmed appointments
      const [[patientRow]] = await db.execute(
        `SELECT id FROM patients WHERE user_id = ?`,
        [userId]
      );
      if (!patientRow)
        return res.status(404).json({ message: "Patient not found" });

      const patientId = patientRow.id;

      await db.execute(
        `UPDATE appointments 
         SET status = 'not done' 
         WHERE patient_id = ? 
         AND status IN ('pending', 'confirmed') 
         AND appointment_time < NOW()`,
        [patientId]
      );

      query = ` 
      SELECT 
          a.*, 
          du.name AS doctor_name, 
          du.avatar AS doctor_avatar, 
          du.online AS doctor_online,
          pu.name AS patient_name, 
          pu.avatar AS patient_avatar, 
          pu.online AS patient_online
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_time DESC
      `;
      values = [patientId];
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const [rows] = await db.execute(query, values);

    const appointments = rows.map((row) => ({
      id: row.id,
      consultation_mode: row.consultation_mode,
      status: row.status,
      doctor_id: row.doctor_id,
      patient_id: row.patient_id,
      date: row.appointment_time
        ? row.appointment_time.toISOString().split("T")[0]
        : null,
      time: row.appointment_time
        ? new Date(row.appointment_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      department: row.department,
      created_at: row.created_at,
      updated_at: row.updated_at,
      doctor: {
        id: row.doctor_id,
        name: row.doctor_name,
        avatar: row.doctor_avatar,
        online: row.doctor_online,
        department: row.department,
      },
      patient: {
        id: row.patient_id,
        name: row.patient_name,
        avatar: row.patient_avatar,
        online: row.patient_online,
      },
    }));

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

const getUpcomingAppoitments = async (req, res) => {
  // const patientId = req.user.id;
  const patientId = req.params.id;
  //    console.log("✅ Route hit. Patient ID:", patientId);
  // console.log("Logged-in user ID:", req.user.id);

  if (req.user.id !== Number(patientId)) {
    return res.status(403).json({ message: "Unauthorized Access" });
  }
  try {
    const [rows] = await db.execute(
      `SELECT a.*, u.name AS doctor_name, u.avatar AS doctor_avatar , u.online AS doctor_online ,d.specialty
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE a.patient_id = ? 
       AND a.status IN ('pending', 'confirmed')
       AND a.appointment_time > NOW()
       ORDER BY a.appointment_time ASC
       LIMIT 1`,
      [patientId]
    );
    //  console.log("Raw rows returned:", rows);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No Upcoming Appointment" });
    }
    const row = rows[0];
    const appointment = {
      id: row.id,
      doctor: row.doctor_name,
      avatar: row.doctor_avatar,
      online: row.doctor_online,
      specialization: row.specialty,
      date: row.appointment_time.toISOString().split("T")[0],
      time: new Date(row.appointment_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: row.status,
      consultation_mode: row.consultation_mode,
    };
    // console.log("Upcoming appointment to send:", appointment);
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching the appointment", error);
    res.status(500).json({ error: "Failed to fetch upcoming appointment" });
  }
};

const cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id; //  This is a string like "23"
  console.log("appointmentId:", appointmentId, typeof appointmentId);

  try {
    const [result] = await db.execute(
      `UPDATE appointments SET status = "cancelled" WHERE id = ?`,
      [appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};
const getAppointmentDetails = async(req,res)=>{
  const appointmentId= req.params.id;
  const downloadAsPDF = req.query.download === "pdf"
  try {
      const [results] =await db.execute(
        `SELECT 
        a.id AS appointmentId,
        DATE_FORMAT(a.appointment_time, '%Y-%m-%d') AS date,
        DATE_FORMAT(a.appointment_time, '%H:%i') AS time,
        a.status,
        a.symptoms,
        a.department,

        du.name AS doctorName,
        du.avatar AS doctorAvatar,

        pu.name AS patientName,
        pu.avatar AS patientAvatar,
        p.gender AS patientGender,
        TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) AS patientAge,
        p.address AS patientAddress,

        t.notes,
        t.diagnosis,
        t.prescription

      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users pu ON p.user_id = pu.id
      LEFT JOIN treatments t ON t.appointment_id = a.id
      WHERE a.id = ?`,
      [appointmentId]
      );
      if(results.length === 0){
        return res.status(404).json({ message:" Appointment not found"});
      }
      const row = results[0];

       const formatted ={
        id:row.appointmentId,
        date:row.date,
        time: row.time,
        status:row.status,
        treatment: row.symptoms,
        department: row.department,
        doctor:{
          id:row.doctorId,
          name:row.doctorName,
          avatar:row.doctorAvatar,
        },
        patient:{
          id:row.patientId,
          name:row.patientName,
          gender: row.patientGender,
          age:row.patientAge,
          address: row.patientAddress,
        },
        notes:row.notes,
        diagnosis:row.diagnosis,
        prescription:row.prescription,
       };
      if (downloadAsPDF) {
      // Generate and stream PDF
      return generateAppointmentPDF(res, {
        patientName: formatted.patient.name,
        age: formatted.patient.age, 
        date: formatted.date,
        time: formatted.time,
        department: formatted.department,
        doctorName: formatted.doctor.name,
        symptoms: formatted.treatment,
        diagnosis: formatted.diagnosis,
        prescription: formatted.prescription,
        notes: formatted.notes,
      });
    }
       res.json(formatted);
    
  } catch (error) {
    console.error("Failed to egt appointment details:",error);
    res.status(500).json({message:"Server error"});
    
  }
}

//Doctors side

const getTodayAppointments = async (req, res) => {
  const userId = req.params.id;
  try {
    const [doctorRow]= await db.execute(
      `SELECT id FROM doctors WHERE user_id = ? `,
      [userId]
    );
     if (doctorRow.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const doctorId = doctorRow[0].id;

    const today = moment().format("YYYY-MM-DD");
    const [appointments] = await db.execute(
      `SELECT 
          a.id,
          a.consultation_mode AS type,
          a.status,
          DATE_FORMAT(a.appointment_time,'%b %e, %Y') AS date,
          TIME_FORMAT(a.appointment_time, '%h:%i %p') AS time,
          u.name AS patient_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ? 
        AND DATE(a.appointment_time) = ?
        AND a.status = 'confirmed'
        ORDER BY a.appointment_time ASC`,
      [doctorId, today]
    );

    const result = appointments.map((row) => ({
      name: row.patient_name,
      date: row.date,
      time: row.time,
      type: row.type,
      status: row.status,
    }));
    res.json(result);
    console.log("Tables Details:", result);
  } catch (error) {
    console.error("Today appointments error:", error);
    res.status(500).json({ error: "Failed to fetch today's appointments" });
  }
};

const acceptAppointments = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const [result] = await db.execute(
      `UPDATE appointments SET status = 'confirmed' WHERE id = ? AND status = 'pending'`,
      [appointmentId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found or already handled!" });
    }
    res.json({ message: "Appointment accepted sucessfully!" });
  } catch (error) {
    console.log("Error accepting the appointment", error);
    res.status(500).json({ message: "Error fetching the appontments" });
  }
};

const rejectAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const [result] = await db.execute(
      `UPDATE appointments SET status = 'cancelled' WHERE id = ? AND status = 'pending'`,
      [appointmentId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found or already handled" });
    }
     // 3. Check if the patient had already paid
    const [paymentRows] = await db.execute(
      `SELECT * FROM payments WHERE appointment_id = ? AND status = 'completed'`,
      [appointmentId]
    );
       if (paymentRows.length > 0) {
      // 4. Refund: update payment status to 'refunded'
      await db.execute(
        `UPDATE payments SET status = 'refunded' WHERE appointment_id = ?`,
        [appointmentId]
      );
    }
    res.json({ message: "Appointment cancelled. Refund processed if payment was completed." });
  } catch (error) {
    console.log("Can't cancel the appointment!", error);
    res.status(500).json({ message: "Failed to reject appointment" });
  }
};
const getAllAppointmentsForDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT 
          a.*, 
          pu.name AS patient_name, 
          pu.avatar AS patient_avatar, 
          pu.online AS patient_online,
          pu.email AS patient_email,

          p.gender AS patient_gender,
          TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) AS patient_age,
          p.phonenumber AS patient_phone,
          P.address AS patient_address,
          p.county AS patient_county,
          p.insurance  AS patient_insurance,
          p.allergies  AS patient_allergies,
          p.blood_group  AS patient_blood_group,
          p.current_medication AS patient_current_medication,
          p.existing_condition AS patient_existing_condition,
          p.bio AS patient_mdeical_history,

          du.name AS doctor_name,
          du.avatar AS doctor_avatar,
          du.online AS doctor_online
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_time DESC`,
      [doctorId]
    );

    const appointments = rows.map((row) => ({
      id: row.id,
      status: row.status,
      appointment_time: row.appointment_time,
      consultation_mode: row.consultation_mode,
      department: row.department,
      created_at: row.created_at,
      updated_at: row.updated_at,
      doctor: {
        id: row.doctor_id,
        name: row.doctor_name,
        avatar: row.doctor_avatar,
        online: row.doctor_online,
      },
      patient: {
        id: row.patient_id,
        name: row.patient_name,
        email: row.patient_email,
        avatar: row.patient_avatar,
        online: row.patient_online,
        gender: row.patient_gender,
        age: row.patient_age,
        phone: row.patient_phone,
        address: row.patient_address,
        county: row.patient_county,
        insurance: row.patient_insurance,
        allergies: row.patient_allergies,
        blood_group: row.patient_blood_group,
        current_medication: row.patient_current_medication,
        existing_condition: row.patient_existing_condition,
        medical_history: row.patient_medical_history,
      },
    }));

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor's full appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

const getAppointmentsForPatient = async (req, res) => {
  const userId = req.params.id;

  try {

    const [rows] = await db.execute(
      `SELECT 
        a.*,
        pu.name AS patient_name,
        du.name AS doctor_name,
        du.avatar AS doctor_avatar,
        du.online AS doctor_online,
        d.id AS doctor_id
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE p.id = ?
        AND a.status IN ('accepted', 'completed')
      ORDER BY a.appointment_time DESC`,
      [userId]
    );
    const appointments = rows.map((row) => {
      const dateTime = new Date(row.appointment_time).toISOString();
      return {
        id: row.id,
        date: dateTime.split("T")[0],
        time: dateTime.split("T")[1].slice(0,5),
        treatment: row.department ?? "Consultation",
        doctor: row.doctor_name,
        isActive: row.status === "accepted",
      };
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getUpcomingAppoitments,
  cancelAppointment,
  getAppointmentDetails,
  getTodayAppointments,
  acceptAppointments,
  rejectAppointment,
  getAllAppointmentsForDoctor,
  getAppointmentsForPatient,
};
