
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { courses, getCourseById } from "@/data/courses";
import { siteImages } from "@/data/images";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import {
  Check,
  Clock,
  Award,
  Layers,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Laptop,
} from "lucide-react";

export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be located.",
      robots: { index: false, follow: false },
    };
  }

  const base = getMetadataBase().origin;
  const canonicalUrl = `${base}/courses/${course.id}`;

  return {
    title: `${course.title} Syllabus & Training`,
    description: course.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      title: `${course.title} | ${siteConfig.name}`,
      description: course.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ${siteConfig.shortName}`,
      description: course.description,
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  const base = getMetadataBase().origin;
  const otherCourses = courses
    .filter((item) => item.id !== course.id)
    .slice(0, 3);

  // Find the first valid course image.
  // Supports both string paths and { url, alt } objects.
  const fallbackImage = "/course-images/Data-analyst.jpeg";

  const imageCandidates = [
    course.thumbnail,
    siteImages.courses?.[course.id],
    siteImages.courses?.["basic-computer"],
    fallbackImage,
  ];

  const courseImage = imageCandidates.find((candidate) => {
    const url =
      typeof candidate === "string"
        ? candidate
        : candidate?.url;

    return typeof url === "string" && url.trim().length > 0;
  });

  const imageUrl =
    typeof courseImage === "string"
      ? courseImage.trim()
      : courseImage?.url?.trim() || fallbackImage;

  const headerImage = {
    url: imageUrl,
    alt:
      typeof courseImage === "object" && courseImage?.alt
        ? courseImage.alt
        : `${course.title} course at ${siteConfig.name}`,
  };

  const enquiryMessage = [
    `Hello ${siteConfig.name}!`,
    "",
    "I would like to enquire about admission.",
    "",
    `Course: ${course.title}`,
    ...(course.fee ? [`Fee: ${course.fee}`] : []),
    `Duration: ${course.duration || "Not specified"}`,
    "",
    "Please share admission details and the next batch schedule.",
    "",
    "Thank you!",
  ].join("\n");

  const whatsappUrl = createWhatsAppUrl(
    enquiryMessage,
    siteConfig.contact.phone
  );

  const enquiryHref =
    whatsappUrl ||
    `/contact?course=${encodeURIComponent(course.title)}`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: base,
    },
    timeRequired: course.durationHours || course.duration,
    educationalLevel: course.level,
    courseCode: course.id,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "blended",
      courseWorkload: course.duration,
    },
  };

  return (
    <PublicShell>
      <JsonLd data={courseSchema} />

      <PageHeader
        title={course.title}
        subtitle={course.description}
        badgeText={`${course.category} · ${course.level}`}
        badgeTone="sky"
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: course.title },
        ]}
        image={headerImage}
        actions={
          <Button
            href={enquiryHref}
            target={whatsappUrl ? "_blank" : undefined}
            rel={whatsappUrl ? "noopener noreferrer" : undefined}
            title={
              whatsappUrl
                ? undefined
                : "WhatsApp is unavailable; use the contact form instead."
            }
            size="lg"
            variant="primary"
            className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-semibold"
          >
            Enquire About Batch
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        }
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="space-y-12 lg:col-span-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-xs">
              <div>
                <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  Duration
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {course.duration}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  Total Lab Hours
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {course.durationHours || "60+ Hours"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  Target Level
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {course.level}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  Evaluation
                </p>
                <p className="mt-0.5 text-sm font-bold text-emerald-700">
                  Verified Certificate
                </p>
              </div>
            </div>

            {/* Practical Competencies Gained */}
            <section aria-labelledby="highlights-heading">
              <h2
                id="highlights-heading"
                className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
              >
                Practical Competencies Gained
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(course.highlights || []).map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-sky-100 bg-white p-4 text-xs text-slate-800 shadow-2xs"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#0284c7] font-bold"
                      aria-hidden
                    />
                    <span className="font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Structured Syllabus Section */}
            {course.syllabus?.length > 0 && (
              <section aria-labelledby="syllabus-heading">
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                  <h2
                    id="syllabus-heading"
                    className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
                  >
                    Course Curriculum & Modules
                  </h2>

                  <span className="text-xs font-bold text-[#0284c7] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    {course.syllabus.length} Modules
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {course.syllabus.map((mod, index) => (
                    <div
                      key={mod.module}
                      className="rounded-2xl border border-sky-100 bg-white p-5 transition-colors hover:border-sky-300 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-xs font-bold text-white shadow-2xs">
                          {index + 1}
                        </span>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {mod.module}
                        </h3>
                      </div>

                      <ul className="mt-3.5 space-y-2 pl-11 text-xs text-slate-600 list-disc leading-relaxed">
                        {(mod.topics || []).map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Career Opportunities */}
            {course.careerOpportunities?.length > 0 && (
              <section aria-labelledby="career-heading">
                <h2
                  id="career-heading"
                  className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
                >
                  Career Roles & Workplace Pathways
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Skills from this course qualify students for
                  computer-assisted office, development, and administrative
                  roles.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {course.careerOpportunities.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-sky-100 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      <Briefcase
                        className="h-3.5 w-3.5 text-[#0284c7]"
                        aria-hidden
                      />
                      {role}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisites & Eligibility */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap
                    className="h-4 w-4 text-[#0284c7]"
                    aria-hidden
                  />
                  <h3>Prerequisites</h3>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {course.prerequisites ||
                    "No prior technical experience needed. Open to all students and beginners."}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Layers
                    className="h-4 w-4 text-[#0284c7]"
                    aria-hidden
                  />
                  <h3>Target Audience</h3>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {course.targetAudience ||
                    "Students, job seekers, and office professionals aiming to upgrade skills."}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24 h-fit">
            {/* Enrollment Consultation Card */}
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <Badge tone="sky">
                  {course.badge || "Institute Program"}
                </Badge>

                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {course.level}
                </span>
              </div>

              <div className="mt-4 space-y-3 divide-y divide-slate-100 text-xs">
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Clock
                      className="h-3.5 w-3.5 text-[#0284c7]"
                      aria-hidden
                    />
                    Duration
                  </span>

                  <span className="font-bold text-slate-900">
                    {course.duration}
                  </span>
                </div>

                {course.durationHours && (
                  <div className="flex items-center justify-between pt-3">
                    <span className="flex items-center gap-2 text-slate-600">
                      <BookOpen
                        className="h-3.5 w-3.5 text-[#0284c7]"
                        aria-hidden
                      />
                      Lab Practice
                    </span>

                    <span className="font-bold text-slate-900">
                      {course.durationHours}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Laptop
                      className="h-3.5 w-3.5 text-[#0284c7]"
                      aria-hidden
                    />
                    Workstation
                  </span>

                  <span className="font-bold text-slate-900">
                    1:1 Individual PC
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Award
                      className="h-3.5 w-3.5 text-[#0284c7]"
                      aria-hidden
                    />
                    Credential
                  </span>

                  <span className="font-bold text-slate-900">
                    Online Verifiable
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  href={enquiryHref}
                  target={whatsappUrl ? "_blank" : undefined}
                  rel={whatsappUrl ? "noopener noreferrer" : undefined}
                  title={
                    whatsappUrl
                      ? undefined
                      : "WhatsApp is unavailable; use the contact form instead."
                  }
                  className="w-full justify-center bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-semibold"
                  size="md"
                >
                  Enquire for Next Batch
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Button>

                <Button
                  href="/certificate-verification"
                  variant="secondary"
                  className="w-full justify-center text-xs font-semibold border-sky-200"
                  size="sm"
                >
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-[#0284c7]"
                    aria-hidden
                  />
                  Verify Certificate
                </Button>
              </div>
            </div>

            {/* Other Courses Widget */}
            <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Explore Other Programs
              </h3>

              <div className="mt-3 space-y-2.5">
                {otherCourses.map((item) => (
                  <Link
                    key={item.id}
                    href={`/courses/${item.id}`}
                    className="group block rounded-xl border border-slate-100 p-3 transition-colors hover:border-sky-300 hover:bg-sky-50/40"
                  >
                    <p className="text-[10px] font-bold text-[#0284c7] uppercase">
                      {item.category}
                    </p>

                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.duration}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </PublicShell>
  );
}
