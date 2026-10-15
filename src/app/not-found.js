import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  FileQuestion,
  Home,
  BookOpen,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PublicShell>
      <Container className="py-20 md:py-28 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-[#0284c7] border border-sky-100 shadow-xs">
          <FileQuestion className="h-8 w-8" aria-hidden />
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#0284c7]">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Page Not Located
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 leading-relaxed">
          The requested page could not be found. It may have been relocated, updated, or temporarily taken down. Access key portals below:
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            href="/"
            size="md"
            variant="primary"
            className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-semibold"
          >
            <Home className="h-4 w-4" aria-hidden />
            Return to Homepage
          </Button>
          <Button
            href="/courses"
            size="md"
            variant="secondary"
            className="border-sky-200"
          >
            <BookOpen className="h-4 w-4 text-[#0284c7]" aria-hidden />
            Browse Courses
          </Button>
        </div>

        {/* Quick portal links */}
        <div className="mx-auto mt-12 max-w-xl border-t border-sky-100 pt-8 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-4">
            Direct Student & Public Portals
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/certificate-verification"
              className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white p-3.5 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 transition-colors shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4 text-[#0284c7] shrink-0" aria-hidden />
              <span>Verify Certificate</span>
            </Link>
            <Link
              href="/results"
              className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white p-3.5 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 transition-colors shadow-2xs"
            >
              <FileCheck2 className="h-4 w-4 text-slate-600 shrink-0" aria-hidden />
              <span>Check Result</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white p-3.5 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 transition-colors shadow-2xs"
            >
              <BookOpen className="h-4 w-4 text-slate-600 shrink-0" aria-hidden />
              <span>About Institute</span>
            </Link>
          </div>
        </div>
      </Container>
    </PublicShell>
  );
}
