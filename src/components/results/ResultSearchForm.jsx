"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/site-config";
import {
  Search,
  Printer,
  FileCheck2,
  AlertCircle,
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileDown,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

export function ResultSearchForm() {
  const [rollNumber, setRollNumber] = useState("");
  const [state, setState] = useState({ type: "idle" });

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = rollNumber.trim();
    if (trimmed.length < 2) {
      setState({
        type: "error",
        message: "Please enter a valid student roll number.",
      });
      return;
    }

    setState({ type: "loading" });
    try {
      const res = await fetch("/api/public/results/search", {
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
            "Could not fetch examination result. Please verify the roll number.",
        });
        return;
      }
      setState({ type: "done", data: json.data });
    } catch {
      setState({
        type: "error",
        message:
          "Network connection error. Please verify your connection and try again.",
      });
    }
  }

  const result = state.type === "done" && state.data.found ? state.data.result : null;

  return (
    <div className="space-y-6">

{/* Search Input Box */}
<div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm sm:p-7">
  <form onSubmit={onSubmit} noValidate>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center">
      <div className="min-w-0">
        <Input
          label="Student Roll Number"
          name="rollNumber"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
          placeholder="e.g. TICE/2026/001"
          autoComplete="off"
          required
          className="border-slate-200 text-base transition-colors focus:border-sky-500 focus:ring-sky-500"
          helperText="Enter the roll number exactly as printed on your admit card or fee receipt."
        />
      </div>

      <div className="flex items-center">
        <Button
          type="submit"
          size="md"
          variant="primary"
          disabled={state.type === "loading"}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.type === "loading" ? (
            <Spinner label="Searching…" size="sm" />
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden="true" />
              Search Result
            </>
          )}
        </Button>
      </div>
    </div>

    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
      <ShieldCheck
        className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
        aria-hidden="true"
      />
      <p className="text-xs leading-5 text-slate-600">
        Enter your correct roll number to retrieve the published examination
        result. Your result will appear below after verification.
      </p>
    </div>
  </form>
</div>


      {/* Dynamic Loading State */}
      {state.type === "loading" ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-10 text-center">
          <Spinner label="Searching examination database for published mark sheet…" size="lg" />
          <p className="mt-2 text-xs text-slate-500">
            Querying roll number &ldquo;{rollNumber.trim()}&rdquo;...
          </p>
        </div>
      ) : null}

      {/* Dynamic Error State */}
      {state.type === "error" ? (
        <Alert tone="error" title="Search Error">
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
                No result found for this roll number.
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                We could not locate an examination result or scorecard for roll number &ldquo;{rollNumber.trim()}&rdquo;.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-amber-800 list-disc pl-4">
                <li>Please verify that the roll number matches your admit card (e.g. <code>TICE/2026/001</code>).</li>
                <li>Results recently conducted may take 24–48 hours to be officially uploaded.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* Official Mark Sheet Presentation Card */}
      {result ? (
        <div className="print-area animate-fade-in-up">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            {/* Marksheet Institutional Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-sky via-brand to-brand-dark text-white shadow-2xs">
                  <GraduationCap className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {siteConfig.name}
                  </h2>
                  <p className="text-xs font-semibold text-brand">
                    Examination Evaluation & Official Statement of Marks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  tone={result.passStatus === "pass" ? "success" : "danger"}
                  className="px-3 py-1 text-xs uppercase"
                >
                  {result.passStatus === "pass" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {result.passStatus === "pass" ? "Result: Passed" : "Result: Failed"}
                </Badge>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Print marks statement"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden />
                  Print Statement
                </button>
              </div>
            </div>

            {/* Student & Course Details */}
            <div className="mt-6">
              <dl className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Candidate Name
                  </dt>
                  <dd className="mt-1 text-base font-extrabold text-slate-900">
                    {result.studentName}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Roll Number
                  </dt>
                  <dd className="mt-1 text-base font-mono font-bold text-[#0284c7]">
                    {result.rollNumber}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 sm:col-span-2">
                  <dt className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    Enrolled Course / Program
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-brand">
                    {result.courseName}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Scorecard Metric Breakdown */}
            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4 border-t border-slate-100 pt-6">
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-center">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Marks Scored
                </span>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {result.marksObtained}
                </p>
                <span className="text-[10px] text-slate-400">out of {result.maxMarks}</span>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-center">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Percentage
                </span>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {result.percentage}%
                </p>
                <span className="text-[10px] text-slate-400">Total Aggregate</span>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-center">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Grade Awarded
                </span>
                <p className="mt-1 text-2xl font-black text-brand">
                  {result.grade}
                </p>
                <span className="text-[10px] text-slate-400">Performance</span>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-center">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Final Status
                </span>
                <p
                  className={`mt-1 text-2xl font-black ${
                    result.passStatus === "pass" ? "text-emerald-700" : "text-danger"
                  }`}
                >
                  {result.passStatus === "pass" ? "PASS" : "FAIL"}
                </p>
                <span className="text-[10px] text-slate-400">Outcome</span>
              </div>
            </div>

            {/* View / Download Result Document Button */}
            {result.resultUrl ? (
              <div className="mt-6 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#0284c7]">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Official Result Document Available
                    </p>
                    <p className="text-xs text-slate-500">
                      Uploaded marksheet document (PDF / Scanned Copy).
                    </p>
                  </div>
                </div>

                <a
                  href={result.resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:from-[#0369a1] hover:to-[#0284c7] transition-all shrink-0 cursor-pointer"
                >
                  <FileDown className="h-4 w-4" aria-hidden />
                  View / Download Result Document
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            ) : null}

            {/* Transcript Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                Published Date:{" "}
                <strong className="text-slate-800">
                  {result.publishedAt
                    ? new Date(result.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Official Record"}
                </strong>
              </span>
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Verified by TICE Examination Controller
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
