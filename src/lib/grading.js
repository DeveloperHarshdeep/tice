export function calculatePercentage(marksObtained, maxMarks) {
  if (maxMarks <= 0) return 0;
  return Math.round((marksObtained / maxMarks) * 10000) / 100;
}

export function calculateGrade(percentage, passingPercentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= passingPercentage) return "D";
  return "F";
}

export function calculatePassStatus(percentage, passingPercentage) {
  if (
    !Number.isFinite(percentage) ||
    !Number.isFinite(passingPercentage) ||
    passingPercentage < 0 ||
    passingPercentage > 100
  ) {
    throw new RangeError("Invalid percentage or passing percentage.");
  }
  return percentage >= passingPercentage ? "pass" : "fail";
}
