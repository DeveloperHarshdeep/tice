import {
  calculateGrade,
  calculatePassStatus,
  calculatePercentage,
} from "./grading";
import { getCourseById } from "@/data/courses";

export function buildResultFields(marksObtained, maxMarks) {
  const percentage = calculatePercentage(marksObtained, maxMarks);
  return {
    marksObtained,
    maxMarks,
    percentage,
    grade: calculateGrade(percentage),
    passStatus: calculatePassStatus(percentage),
  };
}

export function toPublicResult(resultDoc, studentDoc) {
  const course = getCourseById(studentDoc.courseId);
  const payload = {
    studentName: studentDoc.fullName,
    rollNumber: studentDoc.rollNumber,
    courseName: course?.title || studentDoc.courseId,
    marksObtained: resultDoc.marksObtained,
    maxMarks: resultDoc.maxMarks,
    percentage: resultDoc.percentage,
    grade: resultDoc.grade,
    passStatus: resultDoc.passStatus,
    publishedAt: resultDoc.publishedAt || resultDoc.updatedAt,
  };
  if (resultDoc.showPhotoPublicly && studentDoc.photo?.url) {
    payload.photoUrl = studentDoc.photo.url;
  }
  return payload;
}

export function toPublicCertificate(certDoc, studentDoc) {
  return {
    certificateNumber: certDoc.certificateNumber,
    studentName: studentDoc.fullName,
    rollNumber: studentDoc.rollNumber,
    courseName: certDoc.courseName,
    issueDate: certDoc.issueDate,
    status: "verified",
    fileUrl: certDoc.file?.url || null,
  };
}
