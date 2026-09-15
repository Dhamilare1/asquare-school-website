const PDFDocument = require("pdfkit");

const SCHOOL_NAME = process.env.SCHOOL_NAME || '"A"SQUARE EDUCATIONAL SERVICES';

// Writes a one-page report card PDF for the given result data directly
// to the response stream. `data` is whatever resultsService.getStudentResult() returns.
function streamReportCardPdf(res, data) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${data.studentName.replace(/\s+/g, "_")}_${data.term.replace(/\s+/g, "_")}_report.pdf"`
  );

  doc.pipe(res);

  // Header
  doc
    .fontSize(18)
    .fillColor("#0b5d3b")
    .text(SCHOOL_NAME, { align: "center" })
    .fontSize(11)
    .fillColor("#555")
    .text("Student Academic Report Card", { align: "center" })
    .moveDown(1.5);

  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#0b5d3b").stroke();
  doc.moveDown(1);

  // Student info block
  doc.fontSize(11).fillColor("#000");
  const infoY = doc.y;
  doc.text(`Student Name: ${data.studentName}`, 50, infoY);
  doc.text(`Class: ${data.studentClass}`, 320, infoY);
  doc.text(`Term: ${data.term}`, 50, infoY + 20);
  doc.text(`Session: ${data.session}`, 320, infoY + 20);
  doc.moveDown(3);

  // Table header
  const tableTop = doc.y;
  const col = { subject: 50, ca: 260, exam: 330, total: 400, grade: 470 };

  doc.fontSize(10).fillColor("#ffffff");
  doc.rect(50, tableTop, 495, 22).fill("#0b5d3b");
  doc
    .fillColor("#ffffff")
    .text("Subject", col.subject + 5, tableTop + 6)
    .text("CA (40)", col.ca, tableTop + 6)
    .text("Exam (60)", col.exam, tableTop + 6)
    .text("Total", col.total, tableTop + 6)
    .text("Grade", col.grade, tableTop + 6);

  let rowY = tableTop + 22;
  doc.fillColor("#000").fontSize(10);

  data.results.forEach((r, i) => {
    if (i % 2 === 1) {
      doc.rect(50, rowY, 495, 20).fill("#f3f7f4");
      doc.fillColor("#000");
    }
    doc
      .text(r.subject, col.subject + 5, rowY + 5, { width: 200 })
      .text(String(r.ca), col.ca, rowY + 5)
      .text(String(r.exam), col.exam, rowY + 5)
      .text(String(r.total), col.total, rowY + 5)
      .text(r.grade, col.grade, rowY + 5);
    rowY += 20;
  });

  doc.rect(50, tableTop, 495, rowY - tableTop).strokeColor("#dddddd").stroke();

  doc.moveDown(2);
  doc.moveTo(50, rowY + 15).lineTo(545, rowY + 15).strokeColor("#dddddd").stroke();

  doc
    .fontSize(11)
    .fillColor("#0b5d3b")
    .text(`Average Score: ${data.average}%`, 50, rowY + 25);

  doc
    .fontSize(9)
    .fillColor("#8a958e")
    .text(`Generated on ${new Date().toLocaleDateString()}`, 50, 780, { align: "right", width: 495 });

  doc.end();
}

module.exports = { streamReportCardPdf };
