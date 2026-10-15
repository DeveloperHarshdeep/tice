import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";

export const metadata = {
  title: "Courses & Programs",
  description: `Explore practical computer courses, Tally with GST, web development, and diploma programs offered by ${siteConfig.name}.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/courses`,
  },
  openGraph: {
    title: `Courses & Programs | ${siteConfig.name}`,
    description: `Explore practical computer courses, Tally with GST, web development, and diploma programs offered by ${siteConfig.name}.`,
    url: `${getMetadataBase().origin}/courses`,
  },
};

export default function CoursesPage() {
  return (
    <PublicShell>
      <PageHeader
        title="Courses & Training Programs"
        subtitle="Practical, career-oriented computer education designed for students, job seekers, and working professionals. Explore full curriculum and module outlines."
        badgeText="Job-Ready Curriculum"
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
