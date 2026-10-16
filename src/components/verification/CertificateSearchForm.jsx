
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
  Award,
  AlertTriangle,
  LockKeyhole,
  FileCheck,
  ArrowUpRight,
  GraduationCap,
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
            "Verification could not be completed. Please check the roll number and try again.",
        });
        return;
      }

      setState({ type: "done", data: json.data });
    } catch {
      setState({
        type: "error",
        message:
          "Unable to connect to the verification service. Please check your internet connection and try again.",
      });
    }
  }

  const certificate =
    state.type === "done" && state.data?.found
      ? state.data.certificate
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">
      {/* Search panel */}
      <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm sm:rounded-3xl">
        <div className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/70 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-600 shadow-sm sm:h-14 sm:w-14">
              <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700 sm:text-xs">
                  Official Student Services
                </span>
                <span className="rounded-full border border-sky-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                  TICE Registry
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Verify Your Certificate
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Confirm your certificate details using the official student
                roll number issued by Talent Institute &amp; Computer Education.
              </p>
            </div>
          </div>
        </div>


<div className="p-5 sm:p-8">
  <form onSubmit={onSubmit} noValidate className="space-y-5">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center">
      <div className="min-w-0">
        <Input
          label="Student Roll Number"
          name="rollNumber"
          value={rollNumber}
          onChange={(e) =>
            setRollNumber(e.target.value.toUpperCase())
          }
          placeholder="e.g. TICE/2026/001"
          autoComplete="off"
          required
          className="border-slate-200 text-base transition-colors focus:border-sky-500 focus:ring-sky-500"
          helperText="Enter the roll number printed on your admission slip or scorecard."
        />
      </div>

      <div className="flex items-center sm:pt-0">
        <Button
          type="submit"
          size="md"
          variant="primary"
          disabled={state.type === "loading"}
          className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.type === "loading" ? (
            <Spinner label="Verifying..." size="sm" />
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden="true" />
              Verify Certificate
            </>
          )}
        </Button>
      </div>
    </div>
  </form>

  <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
    <LockKeyhole
      className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
      aria-hidden="true"
    />
    <div>
      <p className="text-xs font-semibold text-slate-700">
        Secure verification
      </p>
      <p className="mt-0.5 text-xs leading-5 text-slate-500">
        No account or password is required. Submit your roll number
        to check the available institutional record.
      </p>
    </div>
  </div>
</div>

      </section>

      {/* Loading state */}
      {state.type === "loading" && (
        <section
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-sky-100 bg-white px-5 py-12 text-center shadow-sm sm:py-14"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h3 className="mt-5 text-base font-bold text-slate-900">
            Checking certificate record
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Please wait while we look up the submitted roll number in the
            verification service.
          </p>

          <div className="mt-5 flex justify-center">
            <Spinner
              label={`Verifying ${rollNumber.trim()}...`}
              size="lg"
            />
          </div>
        </section>
      )}

      {/* Error state */}
      {state.type === "error" && (
        <div aria-live="polite">
          <Alert tone="error" title="Verification could not be completed">
            {state.message}
          </Alert>
        </div>
      )}

      {/* Certificate not found */}
      {state.type === "done" && !state.data.found && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                No matching record
              </span>

              <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                Certificate not found
              </h3>

              <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                No issued certificate was found for roll number{" "}
                <span className="font-semibold text-slate-900">
                  {rollNumber.trim()}
                </span>
                .
              </p>

              <div className="mt-4 rounded-xl bg-amber-50/70 p-4">
                <p className="text-xs font-semibold text-amber-900">
                  What you can do
                </p>

                <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-5 text-amber-900/80">
                  <li>
                    Check the spelling and format of your roll number.
                  </li>
                  <li>
                    Use the official number shown on your admission slip or
                    scorecard.
                  </li>
                  <li>
                    If you completed your course recently, allow up to 48
                    hours for administrative issuance.
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRollNumber("");
                  setState({ type: "idle" });
                }}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Search className="h-4 w-4" />
                Try another roll number
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Verified certificate */}
      {certificate && (
        <section className="print-area animate-fade-in-up">
          <div className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm sm:rounded-3xl">
            {/* Status banner */}
            <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50/70 px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                    <ShieldCheck className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="success">Verified Authentic</Badge>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Record found
                      </span>
                    </div>

                    <h2 className="mt-2 break-words text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                      {siteConfig.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Certificate verification record
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Printer className="h-4 w-4" />
                  Print Record
                </button>
              </div>
            </div>

            {/* Certificate details */}
            <div className="p-5 sm:p-8">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <GraduationCap className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Student Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Information associated with this certificate
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-200">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Student Name
                  </dt>
                  <dd className="mt-2 break-words text-base font-bold text-slate-900">
                    {certificate.studentName}
                  </dd>
                </div>

                <div className="min-w-0 rounded-xl border border-sky-200 bg-sky-50/50 p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Roll Number
                  </dt>
                  <dd className="mt-2 break-all font-mono text-base font-bold text-sky-700">
                    {certificate.rollNumber}
                  </dd>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Course Name
                  </dt>
                  <dd className="mt-2 break-words text-base font-bold text-slate-900">
                    {certificate.courseName}
                  </dd>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Certificate Issue Date
                  </dt>
                  <dd className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                    <span>
                      {certificate.issueDate
                        ? new Date(certificate.issueDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Official Record"}
                    </span>
                  </dd>
                </div>

                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Certificate Serial Number
                  </dt>
                  <dd className="mt-2 break-all font-mono text-sm font-bold text-slate-800">
                    {certificate.certificateNumber || "—"}
                  </dd>
                </div>
              </dl>

              {/* Certificate document */}
              {certificate.fileUrl && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-white text-sky-600">
                        <FileCheck className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">
                          Original Certificate
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Open the issued certificate document for viewing
                          or printing.
                        </p>
                      </div>
                    </div>

                    <a
                      href={certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-print inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      View Certificate
                      <ArrowUpRight className="h-4 w-4" />
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Verification footer */}
              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Talent Institute &amp; Computer Education
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Certificate record located in the verification service.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600 sm:self-auto">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                  Online Verification
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
