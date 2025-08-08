import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logoBase64 } from "./logoBase64";

/**
 * Generate a PDF report for doctor payouts
 * @param {Array} payouts - Array of payout objects
 * @param {String} doctorName - Doctor's name
 * @param {String} reportRange - "monthly" | "weekly" | "yearly" | "all"
 */
export const generatePayoutPDF = (
  payouts,
  doctorName = "",
  reportRange = "all"
) => {
  const doc = new jsPDF();
  const currentDate = new Date();

  // === Light blue background header ===
  doc.setFillColor(220, 235, 255); // Light blue
  doc.rect(10, 6, 190, 36, "F");

  // === Centered Title ===
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  const title = `Payout Report${doctorName ? ` - Dr. ${doctorName}` : ""}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - textWidth) / 2;
  doc.text(title, centerX, 20);

  // === Date & Report Type ===
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Date: ${currentDate.toLocaleDateString()}`, 14, 38);
  doc.text(`Report Type: ${reportRange}`, 150, 38);

  // === Filter Data ===
  const filteredData = payouts.filter((p) => {
    const date = new Date(p.date);
    if (reportRange === "monthly") {
      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    } else if (reportRange === "weekly") {
      const diff = (currentDate - date) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    } else if (reportRange === "yearly") {
      return date.getFullYear() === currentDate.getFullYear();
    }
    return true;
  });

  // === Table Data ===
  const tableColumn = ["Date", "Patient", "Status", "Amount", "Transaction ID"];
  const tableRows = [];
  let totalAmount = 0;

  filteredData.forEach((payout) => {
    const rowAmount = Number(payout.amount);
    totalAmount += rowAmount;

    tableRows.push([
      new Date(payout.date).toLocaleDateString(),
      payout.patientName,
      payout.status,
      `KES ${rowAmount.toLocaleString()}`,
      payout.paymentCode || "-",
    ]);
  });

  // === Add Total Row ===
  if (tableRows.length > 0) {
    tableRows.push([
      {
        content: "Total",
        colSpan: 3,
        styles: { halign: "right", fontStyle: "bold" },
      },
      {
        content: `KES ${totalAmount.toLocaleString()}`,
        styles: { fontStyle: "bold" },
      },
      "",
    ]);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 48,
    styles: { fontSize: 9 },
    theme: "grid",
    headStyles: {
      fillColor: [91, 155, 213],
      textColor: 255,
      fontStyle: "bold",
    },
    didDrawPage: (data) => {
      if (logoBase64) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.addImage(
          logoBase64,
          "PNG",
          pageWidth / 2 - 40,
          pageHeight / 2 - 40,
          50,
          50,
          undefined,
          "NONE",
          0.03
        );
      }

      const pageNumber = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Page ${pageNumber}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save(`payout_report_${reportRange}.pdf`);
};
