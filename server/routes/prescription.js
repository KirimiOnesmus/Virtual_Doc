const express = require("express");
const router = express.Router();
const generatePrescriptionPDF = require("../utils/pdfGenerator");
const db = require("../config/db");
const {
  getPrescriptionDataByAppointmentId,
  getPrescriptionsForPatient
} = require("../controllers/prescriptionController");
// const verifyToken = require("../middlewares/verifyToken");

router.get("/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const data = await getPrescriptionDataByAppointmentId(appointmentId);
    if (!data) return res.status(404).json({ error: "Prescription not found" }); 
    await db.execute(
      `UPDATE appointments SET status = 'completed' WHERE id = ?`,
      [appointmentId]
    );

    return generatePrescriptionPDF(res, data);
  } catch (error) {
    console.error("Error generating prescription PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});
router.get("/patient/:id", getPrescriptionsForPatient);

module.exports = router;
