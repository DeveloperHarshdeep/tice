/** Pass threshold (percentage). Adjust per institute policy. */
export const PASS_THRESHOLD_PERCENT = 40;

export function calculatePercentage(marksObtained, maxMarks) {
  if (maxMarks <= 0) return 0;
  return Math.round((marksObtained / maxMarks) * 10000) / 100;
}

export function calculateGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= PASS_THRESHOLD_PERCENT) return "D";
  return "F";
}

export function calculatePassStatus(percentage) {
  return percentage >= PASS_THRESHOLD_PERCENT ? "pass" : "fail";
}
