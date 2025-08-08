const db = require("../config/db");

const getpatientDetails = async (req, res) => {
  const patientId = req.params.id;

  try {
    const [patientRows] = await db.execute(
      `SELECT 
        u.id AS userId, u.name, u.email, u.avatar, u.membership_status, u.created_at AS registerDate,
        p.gender, p.date_of_birth, p.phonenumber,p.allergies,p.blood_group,p.current_medication,p.existing_condition,
        p.emergency_name,emergency_contact, p.county AS city
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?`,
      [patientId]
    );

    if (patientRows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const patient = patientRows[0];

    const [treatmentRows] = await db.execute(
      `SELECT 
    t.id AS treatmentId,
    t.notes,
    t.prescription,
    t.created_at,
    a.appointment_time AS appointmentDate,
    u.name AS doctorName
  FROM treatments t
  JOIN appointments a ON t.appointment_id = a.id
  JOIN doctors d ON a.doctor_id = d.user_id
  JOIN users u ON d.user_id = u.id
  WHERE t.patient_id = ?
  ORDER BY t.created_at DESC`,
      [patientId]
    );

    //formualting the pdf name
    const formatDateForFilename = (dateString) => {
      const date = new Date(dateString);
      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "-");
    };

    const files = treatmentRows.map((t) => ({
      id: t.treatmentId,
      fileName: `Treatment-${formatDateForFilename(t.appointmentDate)}.pdf`,
      note: t.note,
      prescription: t.prescription,
      doctorName: t.doctorName,
      createdAt: t.created_at,
    }));

    res.json({
      ...patient,
      treatments: files,
    });
  } catch (error) {
    console.error("Error fetch the patient data:", error);
    res.status(500).json({ error: "Error fetching patient detail" });
  }
};


// Patients


module.exports = {
  getpatientDetails,
};
