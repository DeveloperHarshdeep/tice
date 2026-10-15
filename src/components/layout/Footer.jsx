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
} from "lucide-react";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";
import { courses } from "@/data/courses";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-sky-100 bg-slate-50/80 text-slate-700">
      {/* Official Credential Verification Callout Strip */}
      <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50/60 via-white to-cyan-50/40 py-6">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] border border-sky-100 shadow-2xs">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Official Credential & Certificate Verification
              </p>
              <p className="text-xs text-slate-500">
                Employers and academic evaluators can instantly authenticate certificates and verify student mark sheets.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/certificate-verification"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3.5 py-2 text-xs font-bold text-sky-950 transition-colors hover:bg-sky-50 shadow-2xs"
            >
              Verify Certificate
              <ArrowRight className="h-3 w-3 text-[#0284c7]" aria-hidden />
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 shadow-2xs"
            >
              Check Student Results
              <FileCheck2 className="h-3 w-3 text-slate-400" aria-hidden />
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Footer Directory */}
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Institute Brand Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-slate-900 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#67e8f9] text-white shadow-2xs">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <span className="text-base font-extrabold tracking-tight">TICE</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Talent Institute
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed">
              {siteConfig.name} delivers structured computer training, financial accounting with GST, and practical software literacy backed by online verification.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1 text-[11px] font-semibold text-sky-900">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0284c7]" aria-hidden />
              <span>Digital Verification Infrastructure</span>
            </div>
          </div>

          {/* Col 2: Educational Programs */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Training Programs
            </h2>
            <ul className="mt-4 space-y-2.5 text-xs">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-slate-600 hover:text-[#0284c7] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {course.title}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/courses"
                  className="font-bold text-[#0284c7] hover:underline inline-flex items-center gap-1 text-xs"
                >
                  View Complete Catalog &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student & Verification Portal */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation & Portals
            </h2>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#0284c7] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-[#0284c7] transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/certificate-verification"
                  className="hover:text-[#0284c7] transition-colors"
                >
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="hover:text-[#0284c7] transition-colors"
                >
                  Result
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#0284c7] transition-colors"
                >
                  About
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-semibold"
                >
                  <span>Staff & Faculty Login</span>
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Working Hours */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Campus & Office Hours
            </h2>
            <ul className="mt-4 space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#0284c7] mt-0.5" aria-hidden />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#0284c7]" aria-hidden />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#0284c7]" aria-hidden />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-[#0284c7]" aria-hidden />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="mt-12 border-t border-sky-100 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {currentYear} {siteConfig.name}. All institutional rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="hover:text-[#0284c7] transition-colors">
              Home
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/courses" className="hover:text-[#0284c7] transition-colors">
              Courses
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/certificate-verification" className="hover:text-[#0284c7] transition-colors">
              Verify Certificate
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/results" className="hover:text-[#0284c7] transition-colors">
              Result
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/about" className="hover:text-[#0284c7] transition-colors">
              About
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
