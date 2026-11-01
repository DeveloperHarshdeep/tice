"use client";

import { useEffect, useState } from "react";
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
import { courses } from "@/data/courses";

// ============================================
// TYPING ANIMATION COMPONENT
// ============================================

// Read course names directly from existing course data.
const courseNames = courses
  .map((course) => course.title || course.name)
  .filter((name) => typeof name === "string" && name.trim().length > 0);

// Fallback course names if course data is empty.
const typingCourses =
  courseNames.length > 0
    ? courseNames
    : [
        "Web Designing",
        "Data Analyst",
        "Tally Prime with GST",
        "Computer Basics",
        "Filmora Editing",
      ];

function TypingHeading() {
  const [courseIndex, setCourseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  // Respect system accessibility settings.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener(
      "change",
      updateMotionPreference
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMotionPreference
      );
    };
  }, []);

  // Typing and deleting animation.
  useEffect(() => {
    if (reducedMotion) return;

    const currentCourse =
      typingCourses[courseIndex % typingCourses.length];

    let typingSpeed = isDeleting ? 40 : 85;

    // Pause after typing the complete course name.
    if (!isDeleting && displayText === currentCourse) {
      typingSpeed = 2000;
    }

    // Brief pause before typing the next course.
    if (isDeleting && displayText === "") {
      typingSpeed = 350;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentCourse) {
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);

        setCourseIndex(
          (previousIndex) =>
            (previousIndex + 1) % typingCourses.length
        );
      } else {
        setDisplayText(
          currentCourse.slice(
            0,
            displayText.length + (isDeleting ? -1 : 1)
          )
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [
    courseIndex,
    displayText,
    isDeleting,
    reducedMotion,
  ]);

  const visibleCourse = reducedMotion
    ? typingCourses[0]
    : displayText;

  return (
    <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

      {/* Static heading */}
      <span className="block">
        Build Your Future With
      </span>

      {/* Animated course name */}
      <span className="mt-3 block min-h-[2.4em] sm:min-h-[2.3em]">

        <span
          aria-hidden="true"
          className="bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0891b2] bg-clip-text text-transparent"
        >
          {visibleCourse}
        </span>

        {/* Blinking typing cursor */}
        {!reducedMotion && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.85em] w-[4px] animate-pulse rounded-full bg-sky-500 align-baseline"
          />
        )}

      </span>

      {/* Accessible and SEO-friendly course description */}
      <span className="sr-only">
        Computer education in Ludhiana at Talent Institute
        and Computer Education. Explore courses including{" "}
        {typingCourses.join(", ")}.
      </span>

    </h1>
  );
}

// ============================================
// MAIN HERO SECTION
// ============================================

export function HeroSection() {
  const [photoUnavailable, setPhotoUnavailable] =
    useState(false);

  const teacher = siteConfig.teacher;

  return (
    <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-b from-sky-50/70 via-white to-white py-12 sm:py-16 lg:py-20">

      {/* ================================= */}
      {/* BACKGROUND DECORATIONS */}
      {/* ================================= */}

      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="pointer-events-none absolute top-1/2 left-0 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">

        {/* ================================= */}
        {/* LEFT CONTENT */}
        {/* ================================= */}

        <div className="space-y-6 lg:col-span-7">

          {/* Institute badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">

            {/* Animated status dot */}
            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />

            </span>

            <span className="text-xs font-bold uppercase tracking-wider text-sky-950">
              {siteConfig.name} (TICE)
            </span>

          </div>

          {/* ================================= */}
          {/* MAIN HEADING WITH TYPING EFFECT */}
          {/* ================================= */}

          <TypingHeading />

          {/* ================================= */}
          {/* TEACHER INFORMATION */}
          {/* ================================= */}

          <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">

            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0284c7]">
              {teacher.qualification} | {teacher.experience}
            </p>

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {siteConfig.name} helps students build useful
              digital skills through practical computer
              training, guided lab practice, and focused
              learning support from {teacher.name}.
            </p>

          </div>

          {/* ================================= */}
          {/* ACTION BUTTONS */}
          {/* ================================= */}

          <div className="flex flex-wrap items-center gap-3 pt-2">

            {/* Explore courses */}
            <Button
              href="/courses"
              size="lg"
              variant="primary"
              className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] font-semibold text-white shadow-md shadow-sky-500/20 transition-all duration-300 hover:from-[#0369a1] hover:to-[#0284c7] hover:shadow-lg"
            >

              Explore All Courses

              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />

            </Button>

            {/* Contact */}
            <Button
              href="/contact"
              size="lg"
              variant="secondary"
              className="border-sky-200 bg-white font-semibold text-sky-950 shadow-sm transition-colors hover:bg-sky-50/80"
            >

              <ShieldCheck
                className="h-4 w-4 text-[#0284c7]"
                aria-hidden="true"
              />

              Enquire Now

            </Button>

            {/* Results */}
            <Button
              href="/results"
              size="lg"
              variant="ghost"
              className="text-slate-600 transition-colors hover:bg-slate-100/70 hover:text-slate-900"
            >

              <FileCheck2
                className="h-4 w-4 text-slate-500"
                aria-hidden="true"
              />

              Check Exam Result

            </Button>

          </div>

          {/* ================================= */}
          {/* INSTITUTE HIGHLIGHTS */}
          {/* ================================= */}

          <div className="grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 text-slate-700 sm:gap-4">

            {/* Instruction */}
            <div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                Instruction
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">
                Hands-on Learning
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Practical computer practice
              </p>

            </div>

            {/* Instructor */}
            <div className="border-l border-slate-200 pl-3 sm:pl-4">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                Instructor
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">
                {teacher.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {teacher.role}
              </p>

            </div>

            {/* Student support */}
            <div className="border-l border-slate-200 pl-3 sm:pl-4">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                Support
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">
                Student Focused
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Guidance at every step
              </p>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* RIGHT SIDE - TEACHER IMAGE */}
        {/* ================================= */}

        <div className="relative lg:col-span-5">

          {/* Main teacher photograph */}
          <div className="relative rounded-3xl border-2 border-white bg-white p-2 shadow-xl shadow-sky-900/10">

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sky-50">

              {!photoUnavailable ? (

                <Image
                  src="/images/teacher.jpeg"
                  alt={`${teacher.name}, ${teacher.role} at ${siteConfig.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  onError={() => setPhotoUnavailable(true)}
                />

              ) : (

                <Image
                  src="/images/client-photo-placeholder.svg"
                  alt="Teacher photograph unavailable"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />

              )}

            </div>

          </div>

          {/* ================================= */}
          {/* FLOATING TEACHER INFORMATION */}
          {/* ================================= */}

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-sky-200/80 bg-white/95 p-3 shadow-md motion-safe:animate-float">

            {/* Icon */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-[#0284c7]">

              <Monitor
                className="h-5 w-5"
                aria-hidden="true"
              />

            </span>

            {/* Teacher details */}
            <div>

              <p className="text-xs font-bold text-slate-900">
                {teacher.name}
              </p>

              <p className="text-[11px] text-slate-500">
                {teacher.qualification} | {teacher.experience}
              </p>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}