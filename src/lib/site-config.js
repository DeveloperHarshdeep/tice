/** Editable institute contact placeholders — replace with verified details. */
export const siteConfig = {
  name: "Talent Institute & Computer Education",
  shortName: "TICE",
  tagline: "Practical computer education for today's digital workplace.",
  experienceYears: 20,
  instructor: "Mr. Sandeep Kumar",
  contact: {
    address: "Gurmail Park, St. 1, Tibba Road, Near Joga Industry / Satsang Ghar, Ramesh Nagar, Ludhiana, Punjab 141008",
    phone: "918195955650",
    email: "sksunny78622@gmail.com",
    hours: "Mon–Sat: Morning 7:00 am to 11:00 am  Evening: 3:00 pm to 9:00 pm",
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
