// Simple, editable grading scale. total is ca_score + exam_score, out of 100.
function gradeFor(total) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

module.exports = { gradeFor };
