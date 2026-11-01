import { uploadBuffer } from "./cloudinary";

function escapeXml(value) {
  return String(value ?? "").replace(/[<>&"']/g, (character) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

/**
 * Generates an elegant, formal A4 PORTRAIT SVG Certificate for Talent Institute & Computer Education.
 * Orientation: Portrait (800px x 1132px, exact A4 aspect ratio 1:1.414).
 */
export function generateCertificateSvg({
  studentName,
  fatherName,
  rollNumber,
  courseName,
  issueDate,
}) {
  const safeStudentName = escapeXml(studentName);
  const safeFatherName = escapeXml(fatherName);
  const safeRollNumber = escapeXml(rollNumber);
  const safeCourseName = escapeXml(courseName);
  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1132" width="800" height="1132" style="background:#ffffff; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <pattern id="cornerPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#38bdf8" opacity="0.3" />
    </pattern>
  </defs>

  <!-- Outer Double Border -->
  <rect x="24" y="24" width="752" height="1084" fill="#ffffff" stroke="#0284c7" stroke-width="4" rx="12" />
  <rect x="34" y="34" width="732" height="1064" fill="#f8fafc" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" rx="8" />
  <rect x="42" y="42" width="716" height="1048" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="6" />

  <!-- Corner Ornamental Accents -->
  <!-- Top-Left -->
  <path d="M 46 90 L 90 46 M 46 110 L 110 46 M 46 70 L 70 46" stroke="#38bdf8" stroke-width="2" opacity="0.6" />
  <!-- Top-Right -->
  <path d="M 754 90 L 710 46 M 754 110 L 690 46 M 754 70 L 730 46" stroke="#38bdf8" stroke-width="2" opacity="0.6" />
  <!-- Bottom-Left -->
  <path d="M 46 1042 L 90 1086 M 46 1022 L 110 1086 M 46 1062 L 70 1086" stroke="#38bdf8" stroke-width="2" opacity="0.6" />
  <!-- Bottom-Right -->
  <path d="M 754 1042 L 710 1086 M 754 1022 L 690 1086 M 754 1062 L 730 1086" stroke="#38bdf8" stroke-width="2" opacity="0.6" />

  <!-- Center Institute Crest Graphic -->
  <g transform="translate(400, 115) scale(1)">
    <circle cx="0" cy="0" r="38" fill="url(#skyGrad)" filter="drop-shadow(0 4px 6px rgba(2,132,199,0.25))" />
    <!-- Mortarboard Icon -->
    <path d="M 0 -14 L -20 -4 L 0 6 L 20 -4 Z" fill="#ffffff" />
    <path d="M -13 0 L -13 12 C -13 17, 13 17, 13 12 L 13 0" fill="none" stroke="#ffffff" stroke-width="2.5" />
    <path d="M 16 -2 L 18 10 C 18 14, 15 14, 15 10" fill="none" stroke="#ffffff" stroke-width="2" />
  </g>

  <!-- Institute Header Title -->
  <text x="400" y="185" text-anchor="middle" font-size="24" font-weight="900" fill="#0f172a" letter-spacing="1.5">
    TALENT INSTITUTE &amp; COMPUTER EDUCATION
  </text>
  <text x="400" y="208" text-anchor="middle" font-size="12" font-weight="700" fill="#0284c7" letter-spacing="3">
    AN INSTITUTE OF INFORMATION TECHNOLOGY &amp; COMPUTER STUDIES
  </text>
  <text x="400" y="226" text-anchor="middle" font-size="10" font-weight="500" fill="#64748b" letter-spacing="1">
    OFFICIAL ACADEMIC CREDENTIAL &amp; VERIFICATION REGISTRY
  </text>

  <!-- Ornamental Divider -->
  <path d="M 220 244 L 370 244 M 430 244 L 580 244" stroke="#38bdf8" stroke-width="1.5" />
  <circle cx="400" cy="244" r="4" fill="#0284c7" />

  <!-- Certificate Heading -->
  <text x="400" y="295" text-anchor="middle" font-size="28" font-weight="800" fill="#0369a1" letter-spacing="2">
    CERTIFICATE OF PROFICIENCY
  </text>
  <text x="400" y="322" text-anchor="middle" font-size="13" font-weight="600" fill="#64748b" letter-spacing="1">
    AND SUCCESSFUL COURSE COMPLETION
  </text>

  <!-- Identification Badges Row -->
  <g transform="translate(400, 375)">
    <!-- Student Registration Number -->
    <rect x="-210" y="-16" width="420" height="32" rx="16" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.2" />
    <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">
      Registration Number: ${safeRollNumber}
    </text>
  </g>

  <!-- Main Body Text -->
  <text x="400" y="450" text-anchor="middle" font-size="14" font-weight="500" fill="#475569" letter-spacing="0.5">
    This is to certify that
  </text>

  <!-- Student Name (Prominent Calligraphic Display) -->
  <text x="400" y="505" text-anchor="middle" font-size="34" font-weight="900" fill="#0f172a" letter-spacing="1">
    ${safeStudentName}
  </text>
  <path d="M 240 522 L 560 522" stroke="#0284c7" stroke-width="2" />

  <!-- Parentage Info -->
  <text x="400" y="555" text-anchor="middle" font-size="14" font-weight="600" fill="#334155">
    Son / Daughter of: ${safeFatherName}
  </text>

  <text x="400" y="605" text-anchor="middle" font-size="14" font-weight="500" fill="#475569" letter-spacing="0.5">
    has satisfactorily completed the comprehensive practical syllabus in
  </text>

  <!-- Course Name Ribbon Box -->
  <g transform="translate(400, 670)">
    <rect x="-280" y="-32" width="560" height="64" rx="16" fill="#f8fafc" stroke="#0284c7" stroke-width="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))" />
    <text x="0" y="8" text-anchor="middle" font-size="20" font-weight="900" fill="#0369a1" letter-spacing="0.5">
      ${safeCourseName}
    </text>
  </g>

  <!-- Assessment Statement -->
  <text x="400" y="745" text-anchor="middle" font-size="12" font-weight="500" fill="#64748b">
    having demonstrated proficient practical capability and passed all prescribed assessments
  </text>
  <text x="400" y="765" text-anchor="middle" font-size="12" font-weight="500" fill="#64748b">
    in accordance with the standards of Talent Institute &amp; Computer Education.
  </text>

  <!-- Issue Date Display -->
  <g transform="translate(400, 815)">
    <rect x="-140" y="-14" width="280" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />
    <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">
      Date of Issue: ${formattedDate}
    </text>
  </g>

  <!-- Institutional Verification Seal Graphic -->
  <g transform="translate(400, 915)">
    <circle cx="0" cy="0" r="44" fill="#ffffff" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="4,2" />
    <circle cx="0" cy="0" r="38" fill="none" stroke="#38bdf8" stroke-width="1.5" />
    <text x="0" y="-12" text-anchor="middle" font-size="8" font-weight="800" fill="#0369a1" letter-spacing="1.5">TALENT INSTITUTE</text>
    <text x="0" y="4" text-anchor="middle" font-size="9" font-weight="900" fill="#0284c7">★ SEAL ★</text>
    <text x="0" y="18" text-anchor="middle" font-size="7" font-weight="700" fill="#64748b">VERIFIED</text>
  </g>

  <!-- Signature Lines -->
  <!-- Left: Course Instructor -->
  <g transform="translate(180, 995)">
    <path d="M -90 0 L 90 0" stroke="#0f172a" stroke-width="1.5" />
    <text x="0" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a">
      Course Instructor
    </text>
    <text x="0" y="34" text-anchor="middle" font-size="10" font-weight="500" fill="#64748b">
      Academic Faculty
    </text>
  </g>

  <!-- Right: Director / Center Head -->
  <g transform="translate(620, 995)">
    <path d="M -90 0 L 90 0" stroke="#0f172a" stroke-width="1.5" />
    <text x="0" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a">
      Director / Center Head
    </text>
    <text x="0" y="34" text-anchor="middle" font-size="10" font-weight="500" fill="#64748b">
      Talent Institute of Computer Education
    </text>
  </g>

  <!-- Bottom Verification Footer Note -->
  <text x="400" y="1065" text-anchor="middle" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="0.5">
    Authenticity can be verified online by searching roll number at /certificate-verification
  </text>
</svg>`;
}

/**
 * Uploads generated SVG certificate to Cloudinary and returns secure URL and publicId.
 */
export async function uploadGeneratedCertificate(certificateDetails) {
  const svg = generateCertificateSvg(certificateDetails);
  const buffer = Buffer.from(svg, "utf-8");

  const result = await uploadBuffer(buffer, {
    folder: "talent-institute/certificates",
    resourceType: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    svg,
  };
}
