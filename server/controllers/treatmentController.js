const db = require("../config/db");

const addPrescription = async (req, res) => {
  const {
    appointment_id,
    doctor_id,
    patient_id,
    diagnosis,
    prescription,
    notes,
  } = req.body;
  console.log(req.body);

  try {
    await db.execute(
      `INSERT INTO treatments(appointment_id, doctor_id, patient_id, diagnosis, prescription, notes) 
   VALUE (?, ?, ?, ?, ?, ?)`,
      [appointment_id, doctor_id, patient_id, diagnosis, prescription, notes]
    );
    res.status(201).json({ message: "Prescription added successfully" });
  } catch (error) {
    console.log("Failed to add prescription:", error);
    res.status(500).json({ message: "Failed to add prescription" });
  }
};
module.exports = { addPrescription };
