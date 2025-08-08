const db = require("../config/db");

const getPrescriptionDataByAppointmentId = async(appointmentId) =>{
    const [rows]  = await db.execute(
      `
    SELECT 
      u.name AS patientName,
      TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) AS age,
      p.address,
      du.name AS doctorName,
      a.department,
      t.diagnosis, 
      t.prescription,
      t.notes,
      t.created_at AS date
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u ON p.user_id = u.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users du ON d.user_id = du.id
    JOIN treatments t ON t.appointment_id = a.id
    WHERE a.id = ?
    `,
    [appointmentId]
    )
    return rows[0];
}

const getPrescriptionsForPatient = async (req, res) => {
  const patientId = req.params.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        a.id AS appointment_id,
        du.name AS doctor_name,
        t.created_at AS date,
        a.consultation_mode
      FROM appointments a
      JOIN treatments t ON t.appointment_id = a.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE a.patient_id = ?
      ORDER BY t.created_at DESC
      `,
      [patientId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching prescriptions for patient:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getPrescriptionDataByAppointmentId,
  getPrescriptionsForPatient
};
