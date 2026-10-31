import {
  calculatePassStatus,
  calculateGrade,
  calculatePercentage,
} from "./grading";
import { getCourseById } from "@/data/courses";

export function buildResultFields(
  marksObtained,
  maxMarks,
  passingPercentage,
  grade,
) {
  if (
    !Number.isFinite(marksObtained) ||
    !Number.isFinite(maxMarks) ||
    !Number.isFinite(passingPercentage) ||
    maxMarks <= 0 ||
    marksObtained < 0 ||
    marksObtained > maxMarks ||
    passingPercentage < 0 ||
    passingPercentage > 100
  ) {
    throw new RangeError("Invalid examination marks or passing percentage.");
  }

  const exactPercentage = (marksObtained / maxMarks) * 100;
  const percentage = calculatePercentage(marksObtained, maxMarks);
  return {
    marksObtained,
    maxMarks,
    percentage,
    passingPercentage,
    grade: grade?.trim() || calculateGrade(percentage, passingPercentage),
    passStatus: calculatePassStatus(exactPercentage, passingPercentage),
  };
}

export function toPublicResult(resultDoc, studentDoc) {
  const course = getCourseById(resultDoc.courseId || studentDoc.courseId);
  const photoUrl = studentDoc.photo?.url || studentDoc.imageUrl || null;
  const payload = {
    studentName: studentDoc.fullName,
    fatherName: studentDoc.fatherName,
    rollNumber: studentDoc.rollNumber,
    courseName:
      resultDoc.courseName ||
      course?.title ||
      studentDoc.courseName ||
      studentDoc.courseId ||
      "Computer Training Course",
    examName: resultDoc.examName || studentDoc.examName || "Final Course Examination",
    resultDate: resultDoc.resultDate || studentDoc.resultDate || null,
    marksObtained: resultDoc.marksObtained,
    maxMarks: resultDoc.maxMarks,
    percentage: resultDoc.percentage,
    passingPercentage: resultDoc.passingPercentage ?? null,
    grade: resultDoc.grade,
    passStatus: resultDoc.passStatus,
    publishedAt: resultDoc.publishedAt || resultDoc.updatedAt || null,
    resultUrl: resultDoc.resultUrl || studentDoc.resultUrl || null,
  };
  if (resultDoc.showPhotoPublicly && photoUrl) {
    payload.photoUrl = photoUrl;
  }
  return payload;
}

export function toPublicCertificate(certDoc, studentDoc) {
  const course = getCourseById(certDoc.courseId || studentDoc.courseId);
  return {
    studentName: studentDoc.fullName,
    rollNumber: studentDoc.rollNumber,
    registrationNumber: studentDoc.rollNumber,
    courseName:
      certDoc.courseName ||
      course?.title ||
      studentDoc.certificateCourseName ||
      studentDoc.courseName ||
      "Computer Training Program",
    issueDate: certDoc.issueDate,
    status: "verified",
    fileUrl: certDoc.file?.url || null,
  };
}
