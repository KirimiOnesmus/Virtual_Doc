const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const generateAppointmentPDF = (
  res,
  {
    patientName,
    age,
    address,
    date,
    time,
    department,
    doctorName,
    symptoms,
    diagnosis,
    prescription,
    notes,
  }
) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // PDF headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=appointment_${Date.now()}.pdf`
  );

  doc.pipe(res);

  const lightBlue = "#d3eaf2";
  const primaryBlue = "#007acc";

  // Doctor Header
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(primaryBlue)
    .text(`Dr. ${doctorName || "Doctor Name"}`, 50, 50);

  doc
    .font("Times-Roman")
    .fontSize(14)
    .text(department || "Department", 55, doc.y - 2);

  const medicIconPath = path.join(__dirname, "../assests/Medic-Icon.png");
  if (fs.existsSync(medicIconPath)) {
    doc.image(medicIconPath, doc.page.width - 90, 40, { width: 40 });
  }

  // Watermark
  const logoPath = path.join(__dirname, "../assests/logo.png");
  if (fs.existsSync(logoPath)) {
    doc
      .opacity(0.5)
      .image(logoPath, 150, 250, { width: 300 })
      .opacity(1);
  }

//   doc.fontSize(10).text(`Date: ${date}  Time: ${time}`, 400, 100);

  // Patient Info
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("black")
    .text("Patient Name:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .text(patientName || "N/A", 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

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

  doc
    .moveDown()
    .font("Helvetica-Bold")
    .text("Appointment Date & Time:", 50)
    .moveDown(0.3)
    .font("Times-Roman")
    .text(`${new Date(`${date} ${time}`).toLocaleString()}`, 50)
    .strokeColor("#ccc")
    .moveTo(50, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  // Symptoms
  doc
    .moveDown(2)
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(primaryBlue)
    .text("Symptoms", 50);

  doc
    .moveDown(0.2)
    .font("Helvetica")
    .fontSize(12)
    .fillColor("black")
    .text(symptoms || "Not provided", {
      width: 500,
      align: "left",
    });

  // Diagnosis
  doc
    .moveDown(1.5)
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

  // Notes
  doc
    .moveDown(1.5)
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(primaryBlue)
    .text("Doctor's Notes", 50);

  doc
    .moveDown(0.2)
    .font("Helvetica")
    .fontSize(12)
    .fillColor("black")
    .text(notes || "Not provided", {
      width: 500,
      align: "left",
    });

  // Footer
  const phoneIcon = path.join(__dirname, "../assests/phone.png");
  const webIcon = path.join(__dirname, "../assests/globe.png");
  const emailIcon = path.join(__dirname, "../assests/envelope.png");

  doc.rect(0, 760, doc.page.width, 40).fill(lightBlue);

  doc.fillColor("black").fontSize(12);
  doc.font("Helvetica-Bold").fontSize(14).text("Virtual Doc", 50, 765);
  doc.font("Times-Italic").fontSize(10).text("Your Health Our Priority", 50, 778);

  if (fs.existsSync(phoneIcon)) {
    doc.image(phoneIcon, 240, 765, { width: 10 });
  }
  doc.text("0768444502", 255, 765);

  if (fs.existsSync(emailIcon)) {
    doc.image(emailIcon, 240, 778, { width: 10 });
  }
  doc.text("virtualdoc@gmail.com", 255, 778);

  if (fs.existsSync(webIcon)) {
    doc.image(webIcon, 400, 765, { width: 10 });
  }
  doc.text("www.virtualdoc.com", 415, 765);

  doc.end();
};

module.exports = generateAppointmentPDF;
