import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/data/images";
import { ArrowLeft, ShieldCheck, Lock, GraduationCap, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Staff & Admin Authentication",
  description: `Administrative portal login for authorized staff of ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Column (Desktop Split): Institutional Brand & Photography */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <Image
            src={siteImages.login.backdrop.url}
            alt="Students and mentors collaborating in TICE computer lab"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-sky-950/40" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-white group"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#67e8f9] text-white shadow-md">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <span className="text-xl font-black tracking-tight">TICE</span>
              <span className="block text-xs font-medium text-slate-300">
                Talent Institute & Computer Education
              </span>
            </div>
          </Link>
        </div>

        {/* Center Editorial Focus */}
        <div className="relative z-10 max-w-lg space-y-4">
          <span className="inline-block rounded-full bg-sky-500/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            Faculty & Administration Portal
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
            Institutional management for student records, certifications & examination grading.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Authorized staff can register students, assign roll numbers, upload official certificates,
            and publish verified examination marks with automated percentage calculations.
          </p>

          <div className="pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Encrypted HTTP-only session tokens with Argon2/bcrypt hashing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Public registry sync for tamper-evident certificate lookup</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Notice */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>Restricted Portal · Authorized Personnel Only</span>
        </div>
      </div>

      {/* Right Column: Sleek Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Navigation Link back */}
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0284c7] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to Public Website
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <LoginForm />
        </div>

        {/* Footer info */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All institutional rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
