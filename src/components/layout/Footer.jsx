
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";
import { courses } from "@/data/courses";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Remove spaces and symbols to create a valid tel: link.
  const phoneNumber = String(siteConfig.contact.phone).replace(
    /[^\d+]/g,
    ""
  );

  // WhatsApp requires the country code, without + or spaces.
  // For India, use 91 followed by the 10-digit mobile number.
  const whatsappNumber = phoneNumber.replace(/\D/g, "").replace(
    /^0/,
    ""
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I would like to enquire about your courses."
  )}`;

  return (
    <footer className="relative mt-auto border-t border-sky-100 bg-slate-50/80 text-slate-700">
      {/* Official Credential Verification Strip */}
      <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50/60 via-white to-cyan-50/40 py-6">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Official Credential & Certificate Verification
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Employers and academic evaluators can authenticate
                certificates and verify student mark sheets online.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/certificate-verification"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3.5 py-2 text-xs font-bold text-sky-950 shadow-sm transition-colors hover:bg-sky-50"
            >
              Verify Certificate
              <ArrowRight className="h-3 w-3 text-sky-600" aria-hidden="true" />
            </Link>

            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Check Student Results
              <FileCheck2 className="h-3 w-3 text-slate-400" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Institute Branding */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 font-bold text-slate-900"
              aria-label="TICE Talent Institute home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-sky-400 to-cyan-300 text-white shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-extrabold tracking-tight">
                  TICE
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Talent Institute
                </span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-slate-600">
              {siteConfig.name} delivers structured computer training,
              financial accounting with GST, and practical software
              literacy backed by online verification.
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1 text-[11px] font-semibold text-sky-900">
              <ShieldCheck
                className="h-3.5 w-3.5 text-sky-600"
                aria-hidden="true"
              />
              Digital Verification Infrastructure
            </div>
          </div>

          {/* Courses */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Training Programs
            </h2>

            <ul className="mt-4 space-y-2.5 text-xs">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 text-slate-600 transition-colors hover:text-sky-600"
                  >
                    <span>{course.title}</span>
                  </Link>
                </li>
              ))}

              <li className="pt-1">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline"
                >
                  View Complete Catalog <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation & Portals
            </h2>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              {[
                { label: "Home", href: "/" },
                { label: "Courses", href: "/courses" },
                {
                  label: "Verify Certificate",
                  href: "/certificate-verification",
                },
                { label: "Student Results", href: "/results" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-sky-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 font-semibold text-slate-500 transition-colors hover:text-slate-900"
                >
                  Staff & Faculty Login
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campus & Office Hours
            </h2>

            <ul className="mt-4 space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">
                  {siteConfig.contact.address}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${phoneNumber}`}
                  className="break-all transition-colors hover:text-sky-600"
                  aria-label={`Call ${siteConfig.contact.phone}`}
                >
                  {siteConfig.contact.phone}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all transition-colors hover:text-sky-600"
                  aria-label={`Email ${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <span>{siteConfig.contact.hours}</span>
              </li>

              {/* WhatsApp Contact Link */}
              <li className="pt-1">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1DA851] hover:shadow-md"
                  aria-label="Chat with TICE on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="mt-12 flex flex-col gap-4 border-t border-sky-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.name}. All institutional rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link href="/" className="transition-colors hover:text-sky-600">
              Home
            </Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link
              href="/courses"
              className="transition-colors hover:text-sky-600"
            >
              Courses
            </Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link
              href="/certificate-verification"
              className="transition-colors hover:text-sky-600"
            >
              Verify Certificate
            </Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link
              href="/results"
              className="transition-colors hover:text-sky-600"
            >
              Results
            </Link>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <Link
              href="/about"
              className="transition-colors hover:text-sky-600"
            >
              About
            </Link>
          </div>
        </div>

        {/* Website Developer Attribution */}
        <div className="mt-5 border-t border-slate-200/70 pt-5 text-center">
          <p className="text-xs text-slate-500">
            Designed and developed by{" "}
            <a
              href="https://hdwebstudios.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky-700 underline decoration-sky-200 underline-offset-4 transition-colors hover:text-sky-500"
            >
              HD Web Studios
            </a>
          </p>
        </div>
      </Container>

      {/* Floating WhatsApp Button - Bottom Right Corner */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:scale-110 hover:bg-[#1DA851] sm:bottom-6 sm:right-6"
        aria-label="Contact TICE on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      </a>
    </footer>
  );
}
