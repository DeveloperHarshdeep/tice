import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";

export const metadata = {
  title: "Computer Courses in Ludhiana",
  description: `Explore computer courses in Ludhiana at TICE, including data analysis, web designing, Tally Prime with GST, Python, Excel, design and AI tools.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/courses`,
  },
  openGraph: {
    title: `Computer Courses in Ludhiana | ${siteConfig.shortName}`,
    description: `Compare current computer courses at ${siteConfig.name} in Ludhiana, from data analysis and web designing to Tally Prime with GST, programming, design and AI tools.`,
    url: `${getMetadataBase().origin}/courses`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function CoursesPage() {
  return (
    <PublicShell>
      <PageHeader
        title="Computer Courses in Ludhiana"
        subtitle={`Explore the current computer courses at ${siteConfig.name} (TICE), including data analysis, web designing, Tally Prime with GST, Python, Excel, graphic design, video editing and AI tools. Review each course page for its syllabus, duration and prerequisites.`}
        badgeText="Course Catalogue"
        badgeTone="sky"
        breadcrumbs={[{ label: "Courses" }]}
        image={siteImages.methodology.codingAndWeb}
      />
      <Container className="py-12 md:py-16">
        <CourseCatalog />
      </Container>
    </PublicShell>
  );
}
