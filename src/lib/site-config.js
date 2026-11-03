/** Editable institute contact placeholders — replace with verified details. */
const INSTITUTE_NAME = "Talent Institute & Computer Education";
const INSTITUTE_ADDRESS =
  "Gurmail Park, St. 1, Tibba Road, Near Joga Industry / Satsang Ghar, Ramesh Nagar, Ludhiana, Punjab 141008";
const INSTITUTE_MAP_QUERY = encodeURIComponent(
  `${INSTITUTE_NAME}, ${INSTITUTE_ADDRESS}`
);

export const siteConfig = {
  name: INSTITUTE_NAME,
  shortName: "TICE",
  tagline: "Practical computer education for today's digital workplace.",
  experienceYears: 20,
  instructor: "Mr. Sandeep Kumar",
  teacher: {
    name: "Mr. Sandeep Kumar",
    qualification: "B.Com",
    experience: "10 Years of Teaching Experience",
    role: "Computer Education Teacher / Instructor",
  },
  contact: {
    address: INSTITUTE_ADDRESS,
    phone: "918195955650",
    email: "sksunny78622@gmail.com",
    hours: "Mon–Sat: Morning 7:00 am to 11:00 am  Evening: 3:00 pm to 9:00 pm",
  },
  location: {
    googleMapsEmbedUrl: `https://www.google.com/maps?q=${INSTITUTE_MAP_QUERY}&output=embed`,
    googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${INSTITUTE_MAP_QUERY}`,
  },
  social: {
    // Add verified links when available
  },
};

export function getMetadataBase() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    return new URL(url);
  } catch {
    return new URL("http://localhost:3000");
  }
}
