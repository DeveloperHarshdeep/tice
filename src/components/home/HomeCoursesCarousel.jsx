"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  GraduationCap,
  IndianRupee,
  MessageCircle,
} from "lucide-react";

import { courses } from "@/data/courses";
import { siteImages } from "@/data/images";
import { siteConfig } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";

import "./HomeCourseCarouse.css";

const featuredCourses = courses.slice(0, 5);

// ============================================
// COURSE CARD
// ============================================

function CourseCard({
  course,
  isExpanded,
  onToggle,
  duplicate = false,
}) {
  const photo =
    course.thumbnail ||
    siteImages.courses?.[course.id] ||
    siteImages.courses?.["basic-computer"];

  const enquiryMessage = [
    `Hello ${siteConfig.name}!`,
    "",
    "Course Enquiry",
    "",
    `Course: ${course.title}`,
    `Course ID: ${course.id}`,
    `Fee: ${course.fee || "Please share the fee"}`,
    `Duration: ${course.duration || "Not specified"}`,
    `Level: ${course.level || "Not specified"}`,
    "",
    "Please share more details about the syllabus, batches, and admission process.",
    "",
    "Thank you!",
  ].join("\n");

  const whatsappUrl = createWhatsAppUrl(
    enquiryMessage,
    siteConfig.contact.phone
  );

  const expandedContentId = `course-details-${course.id}${
    duplicate ? "-duplicate" : ""
  }`;

  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
        isExpanded
          ? "border-sky-300 shadow-[0_18px_45px_rgba(2,132,199,0.12)]"
          : "border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(2,132,199,0.12)]"
      }`}
    >
      {/* ================================= */}
      {/* COURSE IMAGE */}
      {/* ================================= */}

      <Link
        href={`/courses/${course.id}`}
        aria-label={`Explore ${course.title}`}
        className="relative block aspect-[5/3] shrink-0 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-50"
      >
        {photo ? (
          <Image
            src={photo}
            alt={`${course.title} at ${siteConfig.name}`}
            fill
            sizes="(max-width: 639px) 82vw, (max-width: 1023px) 48vw, 31vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap
              className="h-16 w-16 text-sky-300"
              aria-hidden="true"
            />
          </div>
        )}

      </Link>

      {/* ================================= */}
      {/* COURSE CONTENT */}
      {/* ================================= */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Course title */}
        <div>
          <h3 className="text-lg font-extrabold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-sky-700 sm:text-xl">
            <Link
              href={`/courses/${course.id}`}
              className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {course.title}
            </Link>
          </h3>
        </div>

        {/* ================================= */}
        {/* SHORT DESCRIPTION - ALWAYS VISIBLE */}
        {/* ================================= */}

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-slate-500">
          {course.description}
        </p>

        {/* ================================= */}
        {/* EXPANDABLE COURSE DETAILS */}
        {/* ================================= */}

        <div
          id={expandedContentId}
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
          inert={!isExpanded}
          aria-hidden={!isExpanded}
        >
          <div className="min-h-0 overflow-hidden">
            {/* Duration and skill level */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="min-w-0 rounded-2xl border border-sky-100/80 bg-sky-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Duration
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <Clock3
                    className="h-4 w-4 shrink-0 text-sky-600"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {course.duration || "Flexible"}
                  </span>
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Skill Level
                </p>

                <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-800">
                  {course.level || "All levels"}
                </p>
              </div>
            </div>

            {/* ================================= */}
            {/* COURSE HIGHLIGHTS */}
            {/* ================================= */}

            {!!course.highlights?.length && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  What You Will Learn
                </p>

                <ul className="space-y-2.5">
                  {course.highlights
                    .slice(0, 2)
                    .map((item, index) => (
                      <li
                        key={`${course.id}-highlight-${index}`}
                        className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                          aria-hidden="true"
                        />

                        <span className="line-clamp-2">
                          {item}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* ================================= */}
            {/* COURSE FEE */}
            {/* ================================= */}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Course Fee
                </p>

                <p className="mt-1 flex items-center text-xl font-black tracking-tight text-slate-900">
                  {course.fee ? (
                    <>
                      <IndianRupee
                        className="mr-0.5 h-4 w-4 text-sky-600"
                        aria-hidden="true"
                      />

                      {String(course.fee).replace(
                        /^₹\s*/,
                        ""
                      )}
                    </>
                  ) : (
                    "Contact us"
                  )}
                </p>
              </div>

              {course.durationHours &&
                course.durationHours !==
                  "To Be Decided" && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Training
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-700">
                      {course.durationHours}
                    </p>
                  </div>
                )}
            </div>

            {/* ================================= */}
            {/* ACTION BUTTONS */}
            {/* ================================= */}

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <Link
                href={`/courses/${course.id}`}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-center text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                View Details
              </Link>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-3 py-1.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  <MessageCircle
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  Enquire
                </a>
              ) : (
                <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-200 text-xs font-bold text-slate-600">
                  Enquire by phone
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* SHOW MORE / SHOW LESS BUTTON */}
        {/* ================================= */}

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={expandedContentId}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
              isExpanded
                ? "border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                : "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100"
            }`}
          >
            {isExpanded ? (
              <>
                Show Less

                <ChevronUp
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </>
            ) : (
              <>
                Show More

                <ChevronDown
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

// ============================================
// COURSE SEQUENCE
// ============================================

function CourseSequence({
  duplicate = false,
  expandedCourseId,
  onToggleCourse,
}) {
  return (
    <div
      className="home-course-carousel__sequence"
      aria-hidden={duplicate ? "true" : undefined}
      inert={duplicate || undefined}
    >
      {featuredCourses.map((course) => (
        <div
          className="home-course-carousel__slide"
          key={course.id}
        >
          <CourseCard
            course={course}
            isExpanded={
              !duplicate &&
              expandedCourseId === course.id
            }
            onToggle={() => onToggleCourse(course.id)}
            duplicate={duplicate}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN HOME COURSES CAROUSEL
// ============================================

export function HomeCoursesCarousel() {
  const [expandedCourseId, setExpandedCourseId] =
    useState(null);

  const handleToggleCourse = (courseId) => {
    setExpandedCourseId((previousId) =>
      previousId === courseId ? null : courseId
    );
  };

  const isCarouselPaused =
    expandedCourseId !== null;

  return (
    <div>
      {/* ================================= */}
      {/* SECTION HEADER */}
      {/* ================================= */}

      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
            Learn in-demand skills
          </span>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Featured Courses
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Practical training programs designed to
            build skills for your next career step.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 sm:self-auto"
        >
          Show All Courses

          <ArrowUpRight
            className="h-4 w-4"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* ================================= */}
      {/* FEATURED COURSE CAROUSEL */}
      {/* ================================= */}

      {featuredCourses.length > 0 ? (
        <div
          className={`home-course-carousel overflow-hidden ${
            isCarouselPaused
              ? "home-course-carousel--paused"
              : ""
          }`}
          role="region"
          aria-label="Featured courses carousel"
        >
          <div className="home-course-carousel__track">
            <CourseSequence
              expandedCourseId={expandedCourseId}
              onToggleCourse={handleToggleCourse}
            />

            <CourseSequence
              duplicate
              expandedCourseId={expandedCourseId}
              onToggleCourse={handleToggleCourse}
            />
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600">
          Course information is currently unavailable.
        </p>
      )}

      {/* ================================= */}
      {/* BROWSE ALL COURSES BUTTON */}
      {/* ================================= */}

      <div className="mt-7 flex justify-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-sky-500"
        >
          Browse All Courses

          <ArrowUpRight
            className="h-4 w-4"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}