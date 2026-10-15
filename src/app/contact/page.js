import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  HelpCircle,
  Laptop,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Contact & Admissions",
  description: `Contact ${siteConfig.name} (TICE) for course admissions, batch schedules, syllabus, and computer training enquiries.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/contact`,
  },
  openGraph: {
    title: `Contact & Admissions | ${siteConfig.name}`,
    description: `Contact ${siteConfig.name} for course admissions, batch schedules, and training enquiries.`,
    url: `${getMetadataBase().origin}/contact`,
  },
};

const faqs = [
  {
    q: "What batch timings are offered for students and working professionals?",
    a: "We schedule multiple daily batches across morning, afternoon, and evening slots. Dedicated weekend intensive batches are also conducted for working professionals.",
  },
  {
    q: "Do learners get 1:1 computer access throughout the course?",
    a: "Yes. Every student is assigned an individual computer workstation for the entire duration of all practical lab sessions. Workstations are never shared.",
  },
  {
    q: "How does the online certificate verification work after completion?",
    a: "Upon completing syllabus modules and passing the practical evaluation, an institutional certificate is issued with an encrypted serial number that employers can verify on our website.",
  },
  {
    q: "Are absolute beginners or school students eligible to enroll?",
    a: "Yes. Our foundational programs (such as Basic Computer Course and DCA) assume no previous computer or programming background.",
  },
];

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const course = typeof params?.course === "string" ? params.course : "";

  return (
    <PublicShell>
      <PageHeader
        title="Contact & Admissions Desk"
        subtitle="Have questions regarding course curriculum, lab facilities, batch timings, or fee schedules? Reach out to our academic counselling team."
        badgeText="Admissions Open"
        badgeTone="sky"
        breadcrumbs={[{ label: "Contact Us" }]}
        image={siteImages.contact.banner}
      />

      <Container className="py-12 md:py-20 space-y-16">
        {/* Main 2-column Grid: Contact Details & Enquiry Form */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: Contact Info Cards */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Institute Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Reach out via telephone, email, or visit our training center during operational hours.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  icon: MapPin,
                  label: "Campus Address",
                  value: siteConfig.contact.address,
                  sub: "Lab classrooms & administrative enquiry desk",
                },
                {
                  icon: Phone,
                  label: "Admissions Hotline",
                  value: siteConfig.contact.phone,
                  sub: "Telephone & WhatsApp assistance",
                },
                {
                  icon: Mail,
                  label: "Email Address",
                  value: siteConfig.contact.email,
                  sub: "Official inquiries & documentation",
                },
                {
                  icon: Clock,
                  label: "Operating Hours",
                  value: siteConfig.contact.hours,
                  sub: "Classroom batches & lab open",
                },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 rounded-2xl border border-sky-100 bg-white p-4 transition-colors hover:border-sky-300 shadow-2xs"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] border border-sky-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {value}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Demo Session Card */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 text-xs text-slate-700 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-sky-950">
                <Laptop className="h-4 w-4 text-[#0284c7]" aria-hidden />
                <span>Visit for a Guided Lab Orientation</span>
              </div>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Prospective students and parents are welcome to visit our computer lab, review course materials, and attend an orientation session before enrolling.
              </p>
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-sky-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <Badge tone="sky">Online Enquiry</Badge>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Send an Admission Enquiry
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fill in your details and select your course of interest. We will contact you promptly.
                </p>
              </div>

              <div className="mt-6">
                <ContactForm defaultCourse={course} />
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <section aria-labelledby="faq-heading" className="border-t border-sky-100 pt-16">
          <div className="max-w-2xl mb-10">
            <Badge tone="aqua">Admissions Guide</Badge>
            <h2
              id="faq-heading"
              className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Common questions from prospective students and candidates regarding courses, lab hours, and certifications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7]">
                    <HelpCircle className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </PublicShell>
  );
}
