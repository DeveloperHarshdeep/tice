
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
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "About the Institute in Ludhiana",
  description: `Meet ${siteConfig.teacher.name}, owner and lead instructor at ${siteConfig.name} (TICE), and explore the institute's practical teaching approach and professional course certificates.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/about`,
  },
  openGraph: {
    title: `About TICE | Computer Education in Ludhiana`,
    description: `Meet ${siteConfig.instructor} and learn about ${siteConfig.name}'s practical computer education in Ludhiana and ${siteConfig.experienceYears} years of institutional experience.`,
    url: `${getMetadataBase().origin}/about`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

const officialCertificates = [
  {
    title: "Udyam Registration Certificate",
    description:
      "Official Udyam registration document for the institute. View the certificate image for the registration details.",
    image: "/official/Udyam.webp",
    alt: "Udyam Registration Certificate of the institute",
    category: "Official Registration",
  },
];

const ownerCertificates = [
  { title: "Data Analyst", image: "/official/AI_Data_Analyst.webp" },
  { title: "SQL Mastery", image: "/official/SQL_Mastery.webp" },
  { title: "Excel Mastery", image: "/official/Excel_Mastery.webp" },
  { title: "Power BI Mastery", image: "/official/PowerBI_Mastery.webp" },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHeader
        title={`About ${siteConfig.name}`}
        subtitle={`${siteConfig.name} (TICE) offers practical computer education in Ludhiana. Meet owner and lead instructor ${siteConfig.teacher.name}, and learn about the institute's hands-on approach and his professional course certifications.`}
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
                With {siteConfig.experienceYears} years of institutional
                experience, Talent Institute &amp; Computer Education helps
                learners build practical, job-ready computer skills in
                Ludhiana. Owner and lead instructor {siteConfig.teacher.name}
                {" "}supports students through structured lessons, hands-on lab
                practice, and guidance grounded in real-world tools.
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

        {/* Section 3: Owner Course Certificates */}
        <section aria-labelledby="owner-certificates-heading">
          <div className="mb-8 max-w-3xl">
            <Badge tone="aqua">Owner &amp; Lead Instructor</Badge>
            <h2
              id="owner-certificates-heading"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              {siteConfig.teacher.name}&apos;s Course Certificates
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Certificates for courses completed by {siteConfig.teacher.name}
              {" "}in data analysis, SQL, Excel, and Power BI. Select a
              certificate to view it at full size.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ownerCertificates.map((certificate) => (
              <Card
                key={certificate.title}
                className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm"
              >
                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${certificate.title} certificate for ${siteConfig.teacher.name} at full size`}
                  className="relative block aspect-[1.42/1] w-full border-b border-sky-100 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600"
                >
                  <Image
                    src={certificate.image}
                    alt={`${certificate.title} certificate for ${siteConfig.teacher.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-2"
                  />
                </a>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">
                    {certificate.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Course completed by {siteConfig.teacher.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: Official Certificates */}
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
              View the institute&apos;s official registration documentation
              alongside the owner&apos;s professional course certificates.
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

        {/* Section 5: Laboratory Environment */}
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

        {/* Section 6: Faculty & Mentorship */}
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
              Owner and lead instructor {siteConfig.teacher.name} brings a
              {" "}{siteConfig.teacher.qualification} background,
              {` ${siteConfig.teacher.experience.toLowerCase()}`}, and
              additional course training in data analysis, SQL, Excel, and
              Power BI.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 shadow-sm">
              <Image
                src={siteImages.about.faculty1.url}
                alt={siteImages.about.faculty1.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                className="object-cover"
              />
            </div>

            <Card className="border-sky-100 bg-white p-6 shadow-xs">
              <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                Owner &amp; Lead Instructor
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                {siteConfig.teacher.name}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#0284c7]">
                {siteConfig.teacher.qualification} | {siteConfig.teacher.experience}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Alongside a {siteConfig.teacher.qualification} qualification
                and {siteConfig.teacher.experience.toLowerCase()},
                {" "}{siteConfig.teacher.name} has completed courses in data
                analysis, SQL, Excel, and Power BI. He focuses on practical
                computer education that helps students build useful skills for
                academic and professional growth.
              </p>
              <Button
                href="/courses"
                variant="secondary"
                size="sm"
                className="mt-5"
              >
                View computer courses
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Card>
          </div>
        </section>

        {/* Institute Location */}
        <ScrollReveal direction="up">
          <section aria-labelledby="location-heading">
            <div className="mb-8 max-w-2xl">
              <Badge tone="sky">Find Us in Ludhiana</Badge>
              <h2
                id="location-heading"
                className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
              >
                Visit Our Institute
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Find us easily and visit our campus to explore learning
                opportunities and discuss your career goals.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="flex flex-col justify-center rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-[#0284c7]">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug text-slate-900">
                      {siteConfig.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {siteConfig.contact.address}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      Find us near Joga Industry / Satsang Ghar on Tibba Road
                      in Ramesh Nagar. Use the map to plan your visit.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={siteConfig.location.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${siteConfig.name} in Google Maps`}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-brand-dark hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky sm:w-auto"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                  <a
                    href={`tel:+${siteConfig.contact.phone}`}
                    aria-label={`Call ${siteConfig.name}`}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition-all duration-150 hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky sm:w-auto"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call Institute
                  </a>
                </div>
              </div>

              <div className="min-h-[320px] overflow-hidden rounded-2xl border border-sky-100 bg-slate-100 shadow-md md:min-h-[400px]">
                <iframe
                  src={siteConfig.location.googleMapsEmbedUrl}
                  title={`Map showing the location of ${siteConfig.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[320px] w-full border-0 md:h-[400px]"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

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
