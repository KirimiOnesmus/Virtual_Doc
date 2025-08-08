const db = require("../config/db");
const moment = require("moment");
const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.execute(`
            SELECT d.id, u.name, u.email,  u.avatar,  d.specialty, d.address, d.county, d.bio, d.phonenumber 
            FROM  doctors d
            JOIN users u ON d.user_id = u.id`);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSpecialties = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT DISTINCT specialty FROM doctors WHERE specialty IS NOT NULL`
    );
    res.json(rows.map((row) => row.specialty));
  } catch (error) {
    console.error("Error fetching specialities", error);
    res.status(500).json({ error: "Failed to fetch specialities" });
  }
};
// const getDoctorsStats = async (req, res) => {
//   const doctorId = req.params.id;
//   try {
//     // getting actual doctor id not user id
//      const [doctorRow] = await db.execute(
//       `SELECT id FROM doctors WHERE id = ?`,
//       [doctorId]
//     );
//     if (doctorRow.length === 0) {
//       return res.status(404).json({ error: "Doctor not found" });
//     }

//     const today = moment().format("YYYY-MM-DD");
//     const [todayCount] = await db.execute(
//       `SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND DATE(appointment_time) = ?`,
//       [doctorId, today]
//     );

//     const [totalCount] = await db.execute(
//       `SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ?`,
//       [doctorId]
//     );

//     const [patientsCount] = await db.execute(
//       `SELECT COUNT(DISTINCT patient_id) AS count FROM appointments WHERE doctor_id = ?`,
//       [doctorId]
//     );

//     // To be worked on once i am done with payment

//     // const [earnings] =await db.execute(`
//     //   SELECT COALESCE(SUM (amount),0) AS total FROM payments WHERE doctor_id = ?`,
//     // [doctorId]
//     // )
//     const stats = [
//       { title: "Appointment Today", value: todayCount[0].count },
//       { title: "Total Appointments", value: totalCount[0].count },
//       { title: "Total Patients", value: patientsCount[0].count },
//       // { title: "Total Earnings", value: `KES ${parseFloat(earnings[0].total).toFixed(2)}` }
//     ];
//     res.json(stats);
//   } catch (error) {
//     console.error(" Doctor stats error:", error);
//     res.status(500).json({ error: " Failed to fetch stats" });
//   }
// };
const getDoctorsStats = async (req, res) => {
  const userId = req.params.id;

  try {
    const [doctorRow] = await db.execute(
      `SELECT id FROM doctors WHERE user_id = ? `,
      [userId]
    );
    if (doctorRow.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorId = doctorRow[0].id;
    const today = moment().format("YYYY-MM-DD");

    const [todayCount] = await db.execute(
      `SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND DATE(appointment_time) = ? AND status ="confirmed"`,
      [doctorId, today]
    );

    const [totalCount] = await db.execute(
      `SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ?`,
      [doctorId]
    );

    const [patientsCount] = await db.execute(
      `SELECT COUNT(DISTINCT patient_id) AS count FROM appointments WHERE doctor_id = ?`,
      [doctorId]
    );
    const [earnings] = await db.execute(
      `
  SELECT COALESCE(SUM (amount),0) AS total FROM payments WHERE doctor_id = ?`,
      [doctorId]
    );

    const stats = [
      { title: "Appointment Today", value: todayCount[0].count },
      { title: "Total Appointments", value: totalCount[0].count },
      { title: "Total Patients", value: patientsCount[0].count },
      {
        title: "Total Earnings",
        value: `KES ${parseFloat(earnings[0].total).toFixed(2)}`,
      },
    ];
    res.json(stats);
  } catch (error) {
    console.error("Doctor stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Getting patients who have been treated by the doctor

const getTreatedPatients = async (req, res) => {
  const userId = req.params.doctorId;

  try {
    const [doctorRow] = await db.execute(
      `SELECT id FROM doctors WHERE user_id = ?`,
      [userId]
    );
    if (doctorRow.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorId = doctorRow[0].id;
    const [rows] = await db.execute(
      `
SELECT 
  u.id AS userId,
  u.name,
  u.email,
  u.avatar,
  u.created_at AS registerDate,
  p.county AS city,
  MAX(a.appointment_time) AS lastAppointment
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users u ON p.user_id = u.id
WHERE a.doctor_id = ? AND a.status = 'completed' 
GROUP BY u.id, u.name, u.email, u.avatar, u.created_at, p.county
ORDER BY lastAppointment DESC;
  `,
      [doctorId]
    );
    res.json(rows);
    console.log(rows);
  } catch (error) {
    console.error("Error fetching treated patients:", error);
    res.status(500).json({ error: "Ineternal Server Error" });
  }
};
const getDoctorByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.execute(
      `
      SELECT d.id AS doctor_id, u.name, u.email, u.avatar, d.specialty, d.address, d.county, d.bio, d.phonenumber
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]); // Return one doctor
  } catch (error) {
    console.error("Error fetching doctor by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllDoctors,
  getSpecialties,
  getDoctorsStats,
  getTreatedPatients,
  getDoctorByUserId,
};
