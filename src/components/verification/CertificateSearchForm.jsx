"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/site-config";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Printer,
  CheckCircle2,
  Calendar,
  Award,
  AlertTriangle,
  Lock,
  FileCheck,
} from "lucide-react";

export function CertificateSearchForm() {
  const [rollNumber, setRollNumber] = useState("");
  const [state, setState] = useState({ type: "idle" });

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = rollNumber.trim();
    if (!trimmed) {
      setState({
        type: "error",
        message: "Please enter your student roll number.",
      });
      return;
    }

    setState({ type: "loading" });
    try {
      const res = await fetch("/api/public/certificates/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setState({
          type: "error",
          message:
            json.error?.message ||
            "Verification request could not be processed. Please check the entered roll number.",
        });
        return;
      }
      setState({ type: "done", data: json.data });
    } catch {
      setState({
        type: "error",
        message:
          "Network connection failed. Please check your internet connectivity and try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input Box: Student enters only Roll Number */}
      <div className="rounded-2xl border border-sky-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:flex-1">
              <Input
                label="Student Roll Number *"
                name="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. TICE/2026/001"
                autoComplete="off"
                required
                className="border-sky-200 text-base"
                helperText="Enter your official roll number as given on admission slip or scorecard"
              />
            </div>

            <div className="w-full sm:w-auto">
              <Button
                type="submit"
                size="md"
                variant="primary"
                disabled={state.type === "loading"}
                className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold h-11 px-6 shadow-xs shadow-sky-500/20"
              >
                {state.type === "loading" ? (
                  <Spinner label="Verifying…" size="sm" />
                ) : (
                  <>
                    <Search className="h-4 w-4" aria-hidden />
                    Verify Certificate
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 text-[#0284c7]" aria-hidden />
          <span>Official real-time institutional check. No account or password required.</span>
        </div>
      </div>

      {/* Dynamic Loading State */}
      {state.type === "loading" ? (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-12 text-center">
          <Spinner label="Verifying certificate against TICE official registry…" size="lg" />
          <p className="mt-2 text-xs text-slate-500">
            Searching roll number &ldquo;{rollNumber.trim()}&rdquo;...
          </p>
        </div>
      ) : null}

      {/* Error state */}
      {state.type === "error" ? (
        <Alert tone="error" title="Notice">
          {state.message}
        </Alert>
      ) : null}

      {/* Not Found State */}
      {state.type === "done" && !state.data.found ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 text-amber-950 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="text-base font-bold text-amber-950">
                No certificate found for this roll number.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                We could not locate an issued certificate for roll number &ldquo;{rollNumber.trim()}&rdquo;.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-amber-800 list-disc pl-4">
                <li>Please double-check the roll number format (e.g. <code>TICE/2026/001</code>).</li>
                <li>If you completed your course recently, please allow up to 48 hours for administrative issuance.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* Certificate Found State */}
      {state.type === "done" && state.data.found && state.data.certificate ? (
        <div className="print-area animate-fade-in-up">
          <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 sm:p-8 shadow-md relative overflow-hidden">
            {/* Header Stamp */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <ShieldCheck className="h-7 w-7" aria-hidden />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Certificate Found
                    </span>
                    <Badge tone="success">Verified Authentic</Badge>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {siteConfig.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden />
                  Print Record
                </button>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="mt-6">
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Student Name
                  </dt>
                  <dd className="mt-1 text-base font-extrabold text-slate-900">
                    {state.data.certificate.studentName}
                  </dd>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Roll Number
                  </dt>
                  <dd className="mt-1 text-base font-mono font-bold text-[#0284c7]">
                    {state.data.certificate.rollNumber}
                  </dd>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4 sm:col-span-2">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Course Name
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900">
                    {state.data.certificate.courseName}
                  </dd>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Certificate Issue Date
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-slate-900">
                    {state.data.certificate.issueDate
                      ? new Date(state.data.certificate.issueDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Official Record"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-slate-50/70 p-4">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Certificate Serial Identification
                  </dt>
                  <dd className="mt-1 text-sm font-mono font-bold text-slate-900">
                    {state.data.certificate.certificateNumber || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* View Certificate Action Button */}
            {state.data.certificate.fileUrl ? (
              <div className="mt-6 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#0284c7]">
                    <Award className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Official A4 Portrait Certificate Available
                    </p>
                    <p className="text-xs text-slate-500">
                      Stored securely on verified Cloudinary repository.
                    </p>
                  </div>
                </div>

                <a
                  href={state.data.certificate.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:from-[#0369a1] hover:to-[#0284c7] transition-all shrink-0 cursor-pointer"
                >
                  <FileCheck className="h-4 w-4" aria-hidden />
                  View Certificate
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            ) : null}

            {/* Institutional Seal Footnote */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Verified by Talent Institute & Computer Education
              </span>
              <span>Online Verification Record Valid</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
