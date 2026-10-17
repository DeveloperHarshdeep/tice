import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSection } from "@/components/home/HeroSection";
import { courses } from "@/data/courses";
import { siteImages } from "@/data/images";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Monitor,
  ShieldCheck,
  Users,
  ArrowRight,
  FileCheck2,
  Clock,
  Laptop,
  Check,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Talent Institute & Computer Education | Practical IT & Software Training",
  description: `${siteConfig.name} (TICE) offers structured training in computer fundamentals, Tally with GST, web development, Python, and DCA. Official online certificate verification and published examination results.`,
  alternates: {
    canonical: `${getMetadataBase().origin}`,
  },
  openGraph: {
    title: `${siteConfig.name} - Practical Computer Education`,
    description: `${siteConfig.name} offers structured computer training in office applications, Tally accounting, and development.`,
    url: `${getMetadataBase().origin}`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  const base = getMetadataBase().origin;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: "TICE",
    url: base,
    description: siteConfig.tagline,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "IN",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "Institute Certificate with Online Verification",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/courses?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <PublicShell>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {/* 1. VISUALLY COMPELLING HERO WITH REAL PHOTOGRAPHY & MOTION */}
      <HeroSection />

      {/* 2. THE TICE METHODOLOGY & COMPUTER LAB EXPERIENCE (PHOTO-RICH GRID) */}
      <section className="py-16 md:py-24 bg-white border-b border-sky-100" aria-labelledby="lab-experience-heading">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Badge tone="sky">The TICE Difference</Badge>
              <h2
                id="lab-experience-heading"
                className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                Practical lab training designed around{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-[#0ea5e9]">
                  how people actually learn.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe that software fluency isn&apos;t built by memorizing theory — it is mastered
                through continuous keyboard practice on dedicated individual machines under mentor guidance.
              </p>
            </div>
            <Button href="/about" variant="secondary" size="md" className="shrink-0">
              Explore Our Approach
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          {/* 4-Item Photographic Mosaic Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "1:1 Computer Access",
                desc: "Never shared screens. Every enrolled student gets their own individual PC for every session.",
                image: siteImages.methodology.individualLab,
                icon: Monitor,
              },
              {
                title: "Guided Faculty Mentorship",
                desc: "Instructors active on the lab floor to troubleshoot errors, explain formulas, and review work.",
                image: siteImages.methodology.mentorship,
                icon: Users,
              },
              {
                title: "Modern Development & Tools",
                desc: "Hands-on coding in modern text editors, responsive layout frameworks, and Python scripts.",
                image: siteImages.methodology.codingAndWeb,
                icon: Laptop,
              },
              {
                title: "Financial Accounting & GST",
                desc: "Authentic company ledger simulation, tax invoices, purchase vouchers, and compliance reports.",
                image: siteImages.methodology.officeAndSpreadsheets,
                icon: ShieldCheck,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={idx * 100}>
                  <div className="group h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xs transition-all duration-300 hover:border-sky-300 hover:shadow-md">
                    {/* Image Header with Controlled Aspect Ratio & Hover Zoom */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#0284c7] shadow-xs backdrop-blur-xs">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. CORE COMPUTER COURSES WITH HIGH-RESOLUTION PHOTOGRAPHY */}

      {/* 3. FEATURED COURSES WITH FEES AND WHATSAPP ENQUIRIES */}
      <section
        className="border-b border-sky-100 bg-slate-50/50 py-16 md:py-24"
        aria-labelledby="courses-heading"
      >
        <Container>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge tone="sky">Curriculum & Programs</Badge>

              <h2
                id="courses-heading"
                className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                Featured Computer Programs
              </h2>

              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Explore our practical computer courses, transparent course
                fees, structured syllabi, and hands-on training programs.
              </p>
            </div>

            <Button
              href="/courses"
              variant="secondary"
              size="md"
              className="shrink-0 border-sky-200 bg-white text-sky-950 hover:bg-sky-50"
            >
              View All {courses.length} Courses
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          {/* Display only the first five courses */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 5).map((course, idx) => {
              const photo =
                siteImages.courses[course.id] ||
                siteImages.courses["basic-computer"];

              const message = [
                `Hello ${siteConfig.name}!`,
                "",
                "Course Enquiry",
                "",
                `Course: ${course.title}`,
                `Course ID: ${course.id}`,
                `Fee: ${course.fee || "Please share the fee"}`,
                `Duration: ${course.duration || "Not specified"}`,
                `Level: ${course.level || "Not specified"}`,
                "",
                "Please share the syllabus, batch timings, and admission details.",
                "",
                "Thank you!",
              ].join("\n");

              const whatsappUrl =
                createWhatsAppUrl(message, siteConfig.contact.phone) ||
                `/contact?course=${encodeURIComponent(course.title)}`;

              return (
                <ScrollReveal key={course.id} delay={idx * 100}>
                  <Card
                    hoverLift
                    className="group flex h-full flex-col justify-between overflow-hidden border-sky-100 bg-white shadow-sm"
                  >
                    <div>
                      {/* Course Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                        <div className="absolute left-3 top-3">
                          <span className="rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-950 backdrop-blur-sm">
                            {course.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold">
                            <Clock
                              className="h-3.5 w-3.5 text-sky-300"
                              aria-hidden
                            />
                            {course.duration}
                          </span>

                          <span className="rounded bg-sky-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {course.level}
                          </span>
                        </div>
                      </div>

                      {/* Course Information */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#0284c7]">
                          <Link href={`/courses/${course.id}`}>
                            {course.title}
                          </Link>
                        </h3>

                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                          {course.description}
                        </p>

                        {/* Course Fee */}
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Course Fee
                            </p>

                            <p className="mt-1 text-xl font-extrabold text-slate-900">
                              {course.fee || "Contact for fee"}
                            </p>
                          </div>

                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0284c7] shadow-sm">
                            <span className="text-xl font-bold">₹</span>
                          </span>
                        </div>

                        {/* Course Duration */}
                        {course.durationHours ? (
                          <p className="mt-3 text-xs text-slate-500">
                            Training:{" "}
                            <span className="font-semibold text-slate-700">
                              {course.durationHours}
                            </span>
                          </p>
                        ) : null}

                        {/* Core Modules */}
                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            What You Will Learn
                          </p>

                          <ul className="mt-2 space-y-2">
                            {(course.highlights || [])
                              .slice(0, 3)
                              .map((highlight) => (
                                <li
                                  key={highlight}
                                  className="flex items-start gap-2 text-xs text-slate-600"
                                >
                                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0284c7]" aria-hidden />
                                  <span className="line-clamp-2">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Course Actions */}
                    <div className="border-t border-slate-100 p-6 pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          href={`/courses/${course.id}`}
                          variant="secondary"
                          size="sm"
                          className="w-full border-sky-200 text-xs font-semibold hover:bg-sky-50"
                        >
                          Syllabus
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Button>

                        <Button
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary"
                          size="sm"
                          className="w-full bg-[#16a34a] text-xs font-semibold text-white hover:bg-[#15803d]"
                        >
                          Enquire on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>

          {/* View All Courses */}
          {courses.length > 5 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-sky-200 bg-white p-7 text-center shadow-sm sm:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7]">
                <BookOpen className="h-6 w-6" aria-hidden />
              </span>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Explore All Our Courses
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                Find the right program for your career goals. Browse all
                courses, compare fees, explore syllabi, and enquire directly
                with our institute.
              </p>

              <Button
                href="/courses"
                variant="primary"
                size="lg"
                className="mt-5 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] font-bold text-white"
              >
                View All {courses.length} Courses
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Button>
            </div>
          ) : null}
        </Container>
      </section>

      {/* 4. DIGITAL VERIFICATION & EXAMINATION SPOTLIGHT */}
      <section className="py-16 md:py-24 bg-white border-b border-sky-100" aria-labelledby="verification-heading">
        <Container>
          <div className="max-w-2xl mb-12">
            <Badge tone="aqua">Digital Transparency</Badge>
            <h2
              id="verification-heading"
              className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              Online Verification & Result Services
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Talent Institute maintains an official digital database allowing students, recruitment desks, and higher-education evaluators to independently verify authenticity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Box 1: Certificate Verification */}
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 via-white to-white p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-[#0284c7] shadow-2xs">
                  <ShieldCheck className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Verify Issued Certificate
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Enter candidate roll number or unique certificate serial number to confirm authenticity, completion date, course name, and authorized institutional issue.
                </p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0" />
                    Instant confirmation against official institute records
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0" />
                    Direct access to verified digital copy (when authorized)
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button
                  href="/certificate-verification"
                  variant="primary"
                  className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-semibold"
                >
                  Launch Certificate Verifier
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>

            {/* Box 2: Examination Results */}
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-cyan-50/40 via-white to-white p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-[#0891b2] shadow-2xs">
                  <FileCheck2 className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Student Examination Results
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Enrolled students who have completed evaluation assessments can look up their published statement of marks, percentage, and awarded performance grade.
                </p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Marks breakdown, total percentage & letter grade
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Print-ready official statement of marks format
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button
                  href="/results"
                  variant="secondary"
                  className="border-sky-200 bg-white text-sky-950 hover:bg-sky-50 font-semibold"
                >
                  Search Examination Result
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. VISUAL ADMISSION INVITATION BANNER WITH AUTHENTIC LAB PHOTOGRAPHY */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white" aria-labelledby="cta-heading">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-slate-900 text-white shadow-xl">
            {/* Background Image with High Quality Dark Overlay */}
            <div className="absolute inset-0 -z-10">
              <Image
                src={siteImages.hero.primary.url}
                alt="Students learning at TICE computer lab"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover opacity-25 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
            </div>

            <div className="p-8 sm:p-12 lg:p-16 max-w-2xl relative z-10">
              <span className="inline-block rounded-full bg-sky-500/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                Admissions & Lab Orientation
              </span>
              <h2
                id="cta-heading"
                className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight"
              >
                Ready to develop certified practical computer skills?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Whether you need basic typing fluency, commercial GST accounting in Tally, or foundational software skills for office roles, our academic counsellors will guide you to the right batch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  href="/contact"
                  size="lg"
                  variant="primary"
                  className="bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white font-bold shadow-md shadow-sky-500/20"
                >
                  Send Admission Enquiry
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  href="/about"
                  size="lg"
                  variant="secondary"
                  className="border-slate-700 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xs"
                >
                  Learn About TICE
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicShell>
  );
}
