const generatePrescriptionPDF = require("../utils/pdfGenerator");
const{getPrescriptionDataByAppointmentId} = require("../controllers/prescriptionController");
const generatePrescription = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const data = await getPrescriptionDataByAppointmentId(appointmentId);

    if (!data) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Call PDF generator and stream it to response
    generatePrescriptionPDF(res, data);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

module.exports = { generatePrescription }; 