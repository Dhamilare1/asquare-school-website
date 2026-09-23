const path = require("path");
const PDFDocument = require("pdfkit");

const SCHOOL_NAME = process.env.SCHOOL_NAME || '"A"SQUARE EDUCATIONAL SERVICES';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || "Excellence is Our Ultimate Goal";
const SCHOOL_ADDRESS =
  process.env.SCHOOL_ADDRESS || "137, Isuti Road, Moonlight Bus-stop, Egan-Igando, Lagos State, Nigeria.";
const LOGO_PATH = path.join(__dirname, "../assets/logo.png");

// Writes a report card PDF for the given result data directly to the
// response stream. `data` is whatever resultsService.getStudentResult()
// returns — including the optional `termRecord` (remarks, attendance,
// promotion), which may be null if a teacher hasn't filled that in yet.
function streamReportCardPdf(res, data) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${data.studentName.replace(/\s+/g, "_")}_${data.term.replace(/\s+/g, "_")}_report.pdf"`
  );

  doc.pipe(res);

  // ---- Letterhead: logo + school name / motto / address ----
  const headerTop = 50;
  try {
    doc.image(LOGO_PATH, 50, headerTop, { width: 55 });
  } catch (err) {
    // A missing/corrupt logo file should never break the whole PDF —
    // just skip it and carry on with the text.
  }

  doc.fontSize(16).fillColor("#0b5d3b").font("Helvetica-Bold").text(SCHOOL_NAME, 115, headerTop, { width: 380 });
  doc
    .fontSize(9)
    .fillColor("#555")
    .font("Helvetica-Oblique")
    .text(SCHOOL_MOTTO, 115, headerTop + 20, { width: 380 });
  doc
    .fontSize(8)
    .fillColor("#777")
    .font("Helvetica")
    .text(SCHOOL_ADDRESS, 115, headerTop + 34, { width: 380 });

  let cursorY = headerTop + 65; // clears the logo image and the 3 header text lines

  doc
    .fontSize(11)
    .fillColor("#555")
    .font("Helvetica")
    .text("Student Academic Report Card", 50, cursorY, { align: "center", width: 495 });
  cursorY += 22;

  doc.moveTo(50, cursorY).lineTo(545, cursorY).strokeColor("#0b5d3b").stroke();
  cursorY += 15;

  // ---- Student info ----
  doc.fontSize(11).fillColor("#000").font("Helvetica");
  doc.text(`Student Name: ${data.studentName}`, 50, cursorY);
  doc.text(`Class: ${data.studentClass}`, 320, cursorY);
  cursorY += 20;
  doc.text(`Term: ${data.term}`, 50, cursorY);
  doc.text(`Session: ${data.session}`, 320, cursorY);
  cursorY += 35;

  // ---- Subject table ----
  const tableTop = cursorY;
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

  cursorY = rowY + 15;
  doc.moveTo(50, cursorY).lineTo(545, cursorY).strokeColor("#dddddd").stroke();
  cursorY += 12;

  doc
    .fontSize(11)
    .fillColor("#0b5d3b")
    .font("Helvetica-Bold")
    .text(
      `Total Score: ${data.totalScore}    |    Average Score: ${data.averageScore}    |    Percentage: ${data.percentage}%`,
      50,
      cursorY
    );
  cursorY += 28;

  // Safety net: if we're getting close to the bottom of the page (e.g.
  // a class with a lot of subjects), start a fresh page for the rest
  // rather than letting it run off the bottom, unreadable.
  function ensureRoomFor(height) {
    if (cursorY + height > 780) {
      doc.addPage();
      cursorY = 50;
    }
  }

  const tr = data.termRecord;

  // ---- Attendance ----
  if (tr && (tr.timesSchoolOpened != null || tr.timesPresent != null)) {
    ensureRoomFor(40);
    doc.fontSize(10).fillColor("#000").font("Helvetica-Bold").text("Attendance", 50, cursorY);
    cursorY += 15;
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333")
      .text(
        `School opened: ${tr.timesSchoolOpened ?? "-"}    |    Times present: ${
          tr.timesPresent ?? "-"
        }    |    Times absent: ${tr.timesAbsent ?? "-"}`,
        50,
        cursorY
      );
    cursorY += 28;
  }

  // ---- Remarks ----
  function addRemarkBlock(label, text) {
    if (!text) return;
    const blockHeight = doc.heightOfString(text, { width: 495 });
    ensureRoomFor(blockHeight + 30);

    doc.fontSize(10).fillColor("#000").font("Helvetica-Bold").text(label, 50, cursorY);
    cursorY += 15;
    doc.font("Helvetica").fontSize(10).fillColor("#333").text(text, 50, cursorY, { width: 495 });
    cursorY += blockHeight + 18;
  }

  if (tr) {
    addRemarkBlock("Teacher's Remark", tr.teacherRemark);
    addRemarkBlock("Principal's Remark", tr.principalRemark);
  }

  // ---- Promotion (only shown when a teacher has actually recorded
  // one — normally only filled in at the end of Third Term) ----
  if (tr && tr.promotionStatus) {
    let promotionText = "";
    if (tr.promotionStatus === "Promoted") {
      promotionText = `Promoted to ${tr.promotedToClass || "the next class"}.`;
    } else if (tr.promotionStatus === "Repeated") {
      promotionText = `To repeat ${data.studentClass} next session.`;
    } else if (tr.promotionStatus === "Graduated") {
      promotionText = "Graduated.";
    }

    ensureRoomFor(40);
    doc.fontSize(10).fillColor("#000").font("Helvetica-Bold").text("Promotion", 50, cursorY);
    cursorY += 15;
    doc.font("Helvetica").fontSize(10).fillColor("#0b5d3b").text(promotionText, 50, cursorY);
    cursorY += 25;
  }

  doc
    .fontSize(9)
    .fillColor("#8a958e")
    .font("Helvetica")
    .text(`Generated on ${new Date().toLocaleDateString()}`, 50, cursorY + 10, { align: "right", width: 495 });

  doc.end();
}

module.exports = { streamReportCardPdf };
