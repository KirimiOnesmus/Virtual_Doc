const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const generatePrescriptionPDF = (
  res,
  {
    patientName,
    age,
    address,
    date,
    diagnosis,
    prescription,
    doctorName,
    department,
  }
) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Set headers for download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=prescription_${Date.now()}.pdf`
  );

  doc.pipe(res);

  const lightBlue = "#d3eaf2";
  const primaryBlue = "#007acc";

  //Top doctor info
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(primaryBlue)
    .text(`Dr. ${doctorName || "Doctor Name"}`, 50, 50);

  //department
  doc
    .font("Times-Roman")
    .fontSize(14)
    .text(department, 55, doc.y - 2);

  //medic icon/logo
  const medicIconPath = path.join(__dirname, "../assests/Medic-Icon.png");
  if (fs.existsSync(medicIconPath)) {
    const imageWidth = 40; 
    const imageX = doc.page.width - imageWidth - 50; 
    const imageY = 40; 

    doc.image(medicIconPath, imageX, imageY, { width: imageWidth });
  }

  // --- Watermark ---
  const logoPath = path.join(__dirname, "../assests/logo.png");
  if (fs.existsSync(logoPath)) {
    doc
      .opacity(0.5)
      .image(logoPath, 150, 250, { width: 300, align: "center" })
      .opacity(1); // Reset to normal
  }

  doc.fontSize(10).text(`Date: ${date}`, 400, 100);

  // --- Header ---
  // Patient Info
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("black")
    .text("Patient Name:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .fontSize(12)
    .fillColor("black")
    .text(patientName || "N/A", 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  // Address
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .text("Address:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .text(address || "N/A", 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  // Age
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .text("Age:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .text(`${age || "N/A"}`, 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  // Appointment Date
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .text("Appointment Date:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .text(`${new Date(date).toLocaleDateString()}`, 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  // Diagnosis
  doc
    .moveDown(2)
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(primaryBlue)
    .text("Diagnosis", 50);

  doc
    .moveDown(0.2)
    .font("Helvetica")
    .fontSize(12)
    .fillColor("black")
    .text(diagnosis || "Not provided", {
      width: 500,
      align: "left",
    });

  // Prescription
  doc
    .moveDown(1.5)
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(primaryBlue)
    .text("Prescription", 50);

  doc
    .moveDown(0.2)
    .font("Helvetica")
    .fontSize(12)
    .fillColor("black")
    .text(prescription || "Not provided", {
      width: 500,
      align: "left",
    });

  // Bottom of the page

  const phoneIcon = path.join(__dirname, "../assests/phone.png");
  const webIcon = path.join(__dirname, "../assests/globe.png");
  const emailIcon = path.join(__dirname, "../assests/envelope.png");
  // Footer background
  doc.rect(0, 760, doc.page.width, 40).fill(lightBlue);

  // Reset color and font
  doc.fillColor("black").fontSize(12);

  // Left Side
  doc.font("Helvetica-Bold").fontSize(14).text("Virtual Doc", 50, 765);
  doc
    .moveDown(0.2)
    .font("Times-Italic")
    .fontSize(10)
    .text("Your Health Our Priority", 50, 778);

  // Phone Icon + Text
  if (fs.existsSync(phoneIcon)) {
    doc.image(phoneIcon, 240, 765, { width: 10 });
  }
  doc.text("0768444502", 255, 765);

  // Email Icon + Text
  if (fs.existsSync(emailIcon)) {
    doc.image(emailIcon, 240, 778, { width: 10 });
  }
  doc.text("virtualdoc@gmail.com", 255, 778);

  // Website Icon + Text
  if (fs.existsSync(webIcon)) {
    doc.image(webIcon, 400, 765, { width: 10 });
  }
  doc.text("www.virtualdoc.com", 415, 765);

  doc.end();
};

module.exports = generatePrescriptionPDF;
