"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  Monitor,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { siteImages } from "@/data/images";

const heroSlides = [
  {
    id: "students-lab",
    tag: "Practical Lab Training",
    title: "1:1 Dedicated PC Allocation",
    subtitle: "Students working on real-world projects in an individual workstation environment",
    url: siteImages.hero.primary.url,
    alt: siteImages.hero.primary.alt,
  },
  {
    id: "collaborative",
    tag: "Software & Web Design",
    title: "Modern Development & Tools",
    subtitle: "Hands-on coding, responsive web design, and programming foundations",
    url: siteImages.hero.secondary.url,
    alt: siteImages.hero.secondary.alt,
  },
  {
    id: "workstations",
    tag: "Modern Infrastructure",
    title: "Ergonomic Computer Desks",
    subtitle: "High-speed lab setup equipped with modern office productivity suites and TallyPrime",
    url: siteImages.hero.labRow.url,
    alt: siteImages.hero.labRow.alt,
  },
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through genuine educational photographs every 5 seconds for subtle visual motion
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = heroSlides[activeSlide];

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
            Structured computer education engineered for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0891b2]">
              real workplace capability.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            TICE delivers hands-on, lab-oriented training in modern office software,
            financial accounting with TallyPrime GST, web design, and programming
            foundations — backed by an official online credential verification portal.
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

        {/* Right Column: Editorial Photograph Composition with Motion & Interactivity */}
        <div
          className="lg:col-span-5 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Photo Card Frame */}
          <div className="relative rounded-2xl border-2 border-white bg-white p-2 shadow-xl shadow-sky-900/10 transition-transform duration-300">
            {/* Primary Aspect Ratio Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={slide.url}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle photographic vignette overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* On-image caption bar */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="inline-block rounded bg-sky-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      {slide.tag}
                    </span>
                    <p className="mt-1 text-sm font-bold text-white drop-shadow-xs">
                      {slide.title}
                    </p>
                    <p className="text-[11px] text-slate-200 line-clamp-1 drop-shadow-xs">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Navigation Controls & Interactive Indicators */}
            <div className="mt-3 flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-1.5">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`View ${slide.tag} photograph`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? "w-8 bg-[#0284c7]"
                        : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Live Lab Environment</span>
              </div>
            </div>
          </div>

          {/* Genuine Institutional Accent Floating Pill */}
          <div className="absolute -bottom-5 -left-4 hidden sm:flex items-center gap-3 rounded-xl border border-sky-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-md z-20 animate-float">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#0284c7] border border-sky-100">
              <Monitor className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">
                1:1 Workstation Setup
              </p>
              <p className="text-[11px] text-slate-500">
                Dedicated PC for every single student
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
