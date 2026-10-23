"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  Monitor,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  const [photoUnavailable, setPhotoUnavailable] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-b from-sky-50/70 via-white to-white py-12 sm:py-16 lg:py-20">
      {/* Subtle background ambient glows using sky-blue and aqua */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-0 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Educational Headline & Trust Positioning */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-brand-sky animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-950">
              Talent Institute & Computer Education (TICE)
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15]">
            Computer Institute in Ludhiana for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0891b2]">
              practical computer education.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Talent Institute &amp; Computer Education (TICE) has {siteConfig.experienceYears} years of
            institutional experience in Ludhiana, Punjab. Mr. Sandeep Kumar teaches
            practical courses in data analysis, web designing, Tally Prime with GST,
            Python, Excel, graphic design, video editing, and AI tools.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              href="/courses"
              size="lg"
              variant="primary"
              className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white shadow-md shadow-sky-500/20 font-semibold"
            >
              Explore All Courses
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              href="/certificate-verification"
              size="lg"
              variant="secondary"
              className="border-sky-200 bg-white text-sky-950 hover:bg-sky-50/80 font-semibold shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4 text-[#0284c7]" aria-hidden />
              Verify Certificate
            </Button>
            <Button
              href="/results"
              size="lg"
              variant="ghost"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            >
              <FileCheck2 className="h-4 w-4 text-slate-500" aria-hidden />
              Check Exam Result
            </Button>
          </div>

          {/* Genuine Institute Quality Pillars */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 text-slate-700">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Instruction
              </p>
              <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">
                70% Lab Practice
              </p>
              <p className="text-xs text-slate-500">1:1 individual PC setup</p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Authentication
              </p>
              <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">
                Verified Records
              </p>
              <p className="text-xs text-slate-500">Online roll & cert lookup</p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Evaluation
              </p>
              <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">
                Modular Tests
              </p>
              <p className="text-xs text-slate-500">Step-by-step progress</p>
            </div>
          </div>
        </div>

        {/* Right Column: Client portrait */}
        <div className="relative lg:col-span-5">
          <div className="relative rounded-3xl border-2 border-white bg-white p-2 shadow-xl shadow-sky-900/10">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sky-50">
              {!photoUnavailable ? (
                <Image
                  src="/images/client-photo.jpg"
                  alt="The TICE client's portrait"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  onError={() => setPhotoUnavailable(true)}
                />
              ) : (
                <Image
                  src="/images/client-photo-placeholder.svg"
                  alt="Client portrait placeholder. Add the photograph at public/images/client-photo.jpg."
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="mt-4 flex animate-float items-center gap-3 rounded-xl border border-sky-200/80 bg-white/95 p-3 shadow-md">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-[#0284c7]">
              <Monitor className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Talent Institute & Computer Education
              </p>
              <p className="text-[11px] text-slate-500">
                Practical learning, personal guidance
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
