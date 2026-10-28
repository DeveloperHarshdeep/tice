import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCoursesCarousel } from "@/components/home/HomeCoursesCarousel";
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
  Laptop,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Computer Institute in Ludhiana | TICE",
  description: `${siteConfig.name} (TICE) offers computer courses in Ludhiana with ${siteConfig.experienceYears} years' experience. Explore courses and contact the institute.`,
  alternates: {
    canonical: `${getMetadataBase().origin}`,
  },
  openGraph: {
    title: `Computer Institute in Ludhiana | ${siteConfig.shortName}`,
    description: `Practical computer courses in Ludhiana from ${siteConfig.name} (TICE), an institute with ${siteConfig.experienceYears} years of experience.`,
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
    description: `${siteConfig.name} provides computer education in Ludhiana and has ${siteConfig.experienceYears} years of institutional experience.`,
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

  return (
    <PublicShell>
      <JsonLd data={organizationSchema} />

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

      {/* 3. FEATURED COURSES — INFINITE AUTO-SCROLL */}
      <section
        className="overflow-hidden border-b border-sky-100 bg-gradient-to-b from-slate-50/70 via-white to-sky-50/30 py-16 md:py-24"
        aria-label="Featured computer courses"
      >
        <Container>
          <HomeCoursesCarousel />

      {/* Modern Circular Student Showcase */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/60 to-white py-16 sm:py-20 lg:py-24"
        aria-label="TICE student gallery"
      >
        {/* Subtle background accents */}
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />

        <Container>
          <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Text area */}
            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Life at TICE
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                A community built
                <span className="mt-1 block bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  to help you grow.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600 lg:mx-0">
                Every learning journey is different. Get a glimpse of the
                students who make our learning community special.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  Practical Learning
                </span>
                <span className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  Student Community
                </span>
              </div>
            </div>

            {/* Circular photo composition */}
            <div className="relative mx-auto w-full max-w-[560px]">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute left-[8%] top-[12%] h-5 w-5 rounded-full bg-sky-200" />
              <div className="pointer-events-none absolute right-[7%] top-[35%] h-3 w-3 rounded-full bg-cyan-300" />
              <div className="pointer-events-none absolute bottom-[5%] left-[42%] h-7 w-7 rounded-full bg-sky-100" />

              <div className="grid grid-cols-6 items-center gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7">
                {/* Featured circle */}
                <div className="col-span-3 col-start-2 row-span-2">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-[0_12px_40px_rgba(14,165,233,0.16)] ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student1.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 45vw, 260px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Upper-right circle */}
                <div className="col-span-2 col-start-5 row-start-1 mt-5">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-lg ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student2.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 30vw, 170px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Lower-left circle */}
                <div className="col-span-2 col-start-1 row-start-3 -mt-2 sm:mt-0">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-lg ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student4.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 30vw, 170px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Lower-middle circle */}
                <div className="col-span-2 col-start-3 row-start-3 mt-4 sm:mt-7">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-lg ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student5.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 30vw, 170px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Upper-middle/right circle */}
                <div className="col-span-2 col-start-5 row-start-2 -mt-1">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-lg ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student3.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 30vw, 170px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Sixth circle */}
                <div className="col-span-2 col-start-5 row-start-3 -mt-1">
                  <div className="relative aspect-square rounded-full bg-white p-1.5 shadow-lg ring-1 ring-sky-100 sm:p-2">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white">
                      <Image
                        src="/student-images/student6.jpeg"
                        alt="TICE student"
                        fill
                        sizes="(max-width: 640px) 30vw, 170px"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
