import Link from "next/link";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Certificate from "@/models/Certificate";
import Result from "@/models/Result";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import {
  Users,
  Award,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Laptop,
  GraduationCap,
} from "lucide-react";

export const metadata = {
  title: "Dashboard Overview",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  let totalStudents = 0;
  let totalCertificates = 0;
  let totalResults = 0;

  try {
    await connectDB();
    const [studCount, certCount, resultCount] = await Promise.all([
      Student.countDocuments({ archived: false }),
      Certificate.countDocuments({ status: "issued" }),
      Student.countDocuments({
        archived: false,
        $or: [
          { resultUrl: { $exists: true, $ne: "" } },
          { marksObtained: { $exists: true, $ne: null } },
        ],
      }),
    ]);
    totalStudents = studCount;
    totalCertificates = certCount;
    totalResults = resultCount;
  } catch (err) {
    console.warn("Dashboard database query notice:", err.message);
  }

  const sections = [
    {
      title: "Students Management",
      desc: "Enroll new students, assign roll numbers, store records, and upload student identity photos.",
      href: "/admin/dashboard/students",
      count: totalStudents,
      countLabel: "Registered Students",
      icon: Users,
      color: "text-brand bg-sky-50 border-sky-100",
      action: "Manage Students",
    },
    {
      title: "Certificate Issuance",
      desc: "Generate and issue verifiable portrait certificates, upload certificate files, or view generated credentials.",
      href: "/admin/dashboard/certificates",
      count: totalCertificates,
      countLabel: "Issued Certificates",
      icon: Award,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      action: "Issue Certificate",
    },
    {
      title: "Examination Results",
      desc: "Upload marksheets, record scores, calculate percentages and grades automatically, and control publication.",
      href: "/admin/dashboard/results",
      count: totalResults,
      countLabel: "Published / Uploaded",
      icon: ClipboardList,
      color: "text-cyan-700 bg-cyan-50 border-cyan-100",
      action: "Upload / Manage Results",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="sky">Administrative Console</Badge>
              <span className="text-xs text-slate-500">· {siteConfig.name}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage student enrolments, issue authentic portrait certificates, and upload examination marksheets.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button href="/" target="_blank" variant="secondary" size="sm">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              View Public Site
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students Registered
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {totalStudents}
            </p>
            <p className="mt-0.5 text-[11px] text-brand font-medium">
              Active enrolled students
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-[#0284c7]">
            <Users className="h-6 w-6" aria-hidden />
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Certificates Issued
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {totalCertificates}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-700 font-medium">
              Verified portrait credentials
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Award className="h-6 w-6" aria-hidden />
          </span>
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Results Uploaded
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {totalResults}
            </p>
            <p className="mt-0.5 text-[11px] text-cyan-700 font-medium">
              Official scorecards & marksheets
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <ClipboardList className="h-6 w-6" aria-hidden />
          </span>
        </div>
      </div>

      {/* Main Administrative Modules Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.title}
              hoverLift
              className="flex flex-col justify-between border-slate-200/90 bg-white p-6 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${section.color}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 rounded-lg px-2.5 py-1">
                    {section.count} {section.countLabel}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {section.desc}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Button
                  href={section.href}
                  variant="primary"
                  size="sm"
                  className="w-full justify-center text-xs font-semibold"
                >
                  {section.action}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* System Security & Compliance Checklist */}
      <Card className="border-slate-200 bg-white p-6">
        <h3 className="text-sm font-bold text-slate-900">
          Data Integrity & Verification Principles
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs text-slate-600">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <p className="font-semibold text-slate-900">Student Deletion Guard</p>
            <p className="mt-1 text-slate-500">
              Students with issued certificates or published results are archived automatically instead of hard-deleted.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <p className="font-semibold text-slate-900">Draft Status Secrecy</p>
            <p className="mt-1 text-slate-500">
              Certificates and results marked as &ldquo;Draft&rdquo; remain invisible on the public verification portal.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <p className="font-semibold text-slate-900">Private Records Protection</p>
            <p className="mt-1 text-slate-500">
              Sensitive family details (e.g. father&apos;s name) are strictly retained for internal records and never exposed publicly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
