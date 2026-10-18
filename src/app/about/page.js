
import Image from "next/image";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";
import {
  Laptop,
  FileText,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Check,
  GraduationCap,
  Award,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "About the Institute",
  description: `Learn about ${siteConfig.name} (TICE), our educational approach, computer lab facilities, official certificate, and faculty.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/about`,
  },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description: `Learn about ${siteConfig.name}, our educational approach, computer lab facilities, and faculty.`,
    url: `${getMetadataBase().origin}/about`,
  },
};

const facultyProfiles = [
  {
    name: "Senior Computer Instructor",
    role: "Computer Foundations & Office Applications",
    bio: "Specialist in typing speed development, Windows operating systems, and advanced Microsoft Office productivity workflows. Focuses on individual student pacing and lab troubleshooting.",
    specialties: [
      "MS Word & Formatting",
      "Advanced Excel & Spreadsheets",
      "Typing Fluency",
    ],
    image: siteImages.about.faculty1,
  },
  {
    name: "Financial Software Trainer",
    role: "Financial Accounting & Business Taxation",
    bio: "Practitioner with extensive experience in double-entry bookkeeping, TallyPrime ERP, and practical GST return workflows. Guides students through real company transaction simulation.",
    specialties: [
      "TallyPrime ERP",
      "GST Invoicing & Returns",
      "Inventory & Vouchers",
    ],
    image: siteImages.about.faculty2,
  },
];

const officialCertificates = [
  {
    title: "Udyam Registration Certificate",
    description:
      "Official Udyam registration document for the institute. View the certificate image for the registration details.",
    image: "/official/Udyam.jpeg",
    alt: "Udyam Registration Certificate of the institute",
    category: "Official Registration",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHeader
        title={`About ${siteConfig.shortName}`}
        subtitle={`${siteConfig.name} (TICE) is dedicated to delivering structured, practical computer training that builds certified, workplace-ready digital competence.`}
        badgeText="Institute Overview"
        badgeTone="sky"
        breadcrumbs={[{ label: "About" }]}
        image={siteImages.about.banner}
        actions={
          <Button
            href="/contact"
            size="md"
            variant="primary"
            className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-semibold"
          >
            Admissions Enquiry
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        }
      />

      <Container className="space-y-20 py-12 md:py-20">
        {/* Section 1: Institute Mission */}
        <section aria-labelledby="mission-heading">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-5 lg:col-span-6">
              <Badge tone="sky">Educational Mission</Badge>

              <h2
                id="mission-heading"
                className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                Bridging the digital capability gap through{" "}
                <span className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] bg-clip-text text-transparent">
                  structured, lab-first education.
                </span>
              </h2>

              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Modern workplaces require reliable computer fluency: creating
                professional business documents, managing complex spreadsheets,
                handling GST accounting vouchers, and navigating digital
                workflows.
              </p>

              <p className="text-sm leading-relaxed text-slate-600">
                Talent Institute was founded to make this training structured,
                accessible, and rigorously evaluated. We replace passive
                lectures with hands-on practice, ensuring that every concept
                learned is immediately executed on an individual computer.
              </p>

              <div className="pt-2">
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 shadow-2xs">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-950">
                    Our Guiding Principle
                  </p>
                  <p className="mt-1 text-xs font-medium italic leading-relaxed text-slate-700 sm:text-sm">
                    &ldquo;Knowledge in computing is validated only when a
                    student can independently complete the task on a computer
                    keyboard and screen.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal direction="up">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-xl shadow-sky-950/10">
                  <Image
                    src={siteImages.about.mission.url}
                    alt={siteImages.about.mission.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-bold drop-shadow-xs">
                      Active Student Training
                    </p>
                    <p className="text-xs text-slate-200 drop-shadow-xs">
                      Focused lab sessions designed for immediate skill
                      acquisition
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Section 2: Teaching Methodology */}
        <section
          aria-labelledby="methodology-heading"
          className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/20 p-8 md:p-12"
        >
          <div className="mb-10 max-w-2xl">
            <Badge tone="aqua">Teaching Methodology</Badge>
            <h2
              id="methodology-heading"
              className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
            >
              The TICE 70/30 Learning Architecture
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A balanced pedagogical formula designed for long-term skill
              retention and workplace independence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                time: "30% Session Time",
                title: "Concept Introduction",
                desc: "Instructors demonstrate software features, formulas, accounting ledgers, and coding logic step-by-step.",
              },
              {
                step: "2",
                time: "70% Session Time",
                title: "Individual Guided Lab",
                desc: "Students execute exercises and solve assigned real-world scenarios on dedicated machines with faculty guidance.",
              },
              {
                step: "3",
                time: "Continuous Evaluation",
                title: "Modular Practical Tests",
                desc: "Periodic timed evaluations ensure typing speed, voucher accuracy, and problem-solving before advancing.",
              },
            ].map((col) => (
              <div
                key={col.step}
                className="flex flex-col justify-between rounded-2xl border border-sky-200/80 bg-white p-6 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-sm font-bold text-white shadow-2xs">
                      {col.step}
                    </span>
                    <span className="rounded bg-sky-50 px-2 py-1 text-[11px] font-bold text-[#0284c7]">
                      {col.time}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {col.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {col.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Official Certificates */}
        <section
          aria-labelledby="certificates-heading"
          id="official-certificates"
        >
          <div className="mb-8 max-w-3xl">
            <Badge tone="sky">Official Documentation</Badge>
            <h2
              id="certificates-heading"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              Official Certificates & Registration
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              View the institute&apos;s official registration documentation.
              We believe in presenting relevant institutional records
              transparently.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {officialCertificates.map((certificate) => (
              <Card
                key={certificate.title}
                className="group overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 border-b border-sky-100 bg-sky-50/60 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {certificate.category}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                      {certificate.title}
                    </h3>
                  </div>
                </div>

                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${certificate.title} in a new tab`}
                  className="relative block overflow-hidden bg-slate-50 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={certificate.image}
                      alt={certificate.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </a>

                <div className="p-5">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {certificate.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
                      <CheckCircleIcon />
                      Certificate displayed
                    </span>

                    <a
                      href={certificate.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-50"
                    >
                      View Certificate
                      <ExternalLink
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: Laboratory Environment */}
        <section aria-labelledby="facility-heading">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <ScrollReveal direction="up">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-xl shadow-sky-950/10">
                  <Image
                    src={siteImages.about.lab.url}
                    alt={siteImages.about.lab.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-bold">
                      Dedicated Computer Lab Facility
                    </p>
                    <p className="text-xs text-slate-200">
                      Equipped with software suites and individual workstations
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="order-1 space-y-5 lg:order-2 lg:col-span-6">
              <Badge tone="sky">Computer Lab Facility</Badge>
              <h2
                id="facility-heading"
                className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                Hardware & Learning Infrastructure
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Our lab facility is intentionally arranged to give students
                an uninterrupted, focused workspace with individual system
                allocation.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "1:1 Individual Workstations",
                    desc: "Every student operates their own keyboard, mouse, and display for maximum practice time.",
                  },
                  {
                    title: "Industry Software Configurations",
                    desc: "Configured for office applications, accounting software, code editors, and web tools.",
                  },
                  {
                    title: "Flexible Batch Allocations",
                    desc: "Batch options designed to accommodate school students, college learners, and working professionals.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-sky-100 bg-white p-4 shadow-2xs"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[#0284c7]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Faculty & Mentorship */}
        <section aria-labelledby="faculty-heading">
          <div className="mb-10 max-w-2xl">
            <Badge tone="aqua">Teaching Mentors</Badge>
            <h2
              id="faculty-heading"
              className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
            >
              Faculty & Instructors
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Experienced instructors providing hands-on coaching and
              individual doubt resolution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {facultyProfiles.map((faculty) => (
              <Card
                key={faculty.role}
                hoverLift
                className="group overflow-hidden border-sky-100 bg-white shadow-xs"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-100 sm:w-48">
                    <Image
                      src={faculty.image.url}
                      alt={faculty.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                        Faculty
                      </span>

                      <h3 className="mt-2 text-base font-bold text-slate-900">
                        {faculty.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-[#0284c7]">
                        {faculty.role}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        {faculty.bio}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                      {faculty.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 6: Admissions Invitation */}
        <section className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50/50 p-8 shadow-sm sm:p-12">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-950">
                Personalized Lab Orientation
              </span>
              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
                Have questions about batch schedules or syllabus?
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Visit our institute desk for a counselling session and guided
                computer lab walkthrough.
              </p>
            </div>

            <Button
              href="/contact"
              size="lg"
              variant="primary"
              className="shrink-0 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] font-semibold text-white"
            >
              Contact Admissions Desk
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </section>
      </Container>
    </PublicShell>
  );
}

function CheckCircleIcon() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
      <Check className="h-3 w-3" aria-hidden="true" />
    </span>
  );
}
