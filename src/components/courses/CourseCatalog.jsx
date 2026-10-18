
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { courses, courseCategories } from "@/data/courses";
import { siteImages } from "@/data/images";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Search,
  BookOpen,
  Clock3,
  ArrowUpRight,
  CheckCircle2,
  X,
  IndianRupee,
  MessageCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [enquiryError, setEnquiryError] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        category === "all" || course.category === category;

      if (!matchesCategory) return false;
      if (!search) return true;

      return [
        course.title,
        course.description,
        course.category,
        ...(course.highlights || []),
        ...(course.careerOpportunities || []),
      ].some((item) => item?.toLowerCase().includes(search));
    });
  }, [query, category]);

  const handleEnquire = (course) => {
    const message = [
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
      message,
      siteConfig.contact.phone
    );

    if (!whatsappUrl) {
      setEnquiryError(
        "The institute's WhatsApp number is missing or invalid. Please contact the institute by phone or email."
      );
      return;
    }

    setEnquiryError("");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="space-y-8">
      {/* Search and category navigation */}
      <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50/70 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
              Find your direction
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Explore our courses
            </h2>
            <p className="text-sm text-slate-500">
              Find the right skills for your next career step.
            </p>
          </div>

          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600"
              aria-hidden="true"
            />
            <Input
              name="course-search"
              aria-label="Search courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, skills or tools..."
              className="h-12 rounded-xl border-sky-100 bg-white pl-12 pr-10 text-sm shadow-sm focus:border-sky-400 focus:ring-sky-500/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-sky-50 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Course categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === "all"}
              onClick={() => setCategory("all")}
              className={`rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                category === "all"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
              }`}
            >
              All Courses <span className="ml-1 opacity-75">{courses.length}</span>
            </button>

            {courseCategories.map((cat) => {
              const count = courses.filter(
                (course) => course.category === cat
              ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={category === cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                    category === cat
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  }`}
                >
                  {cat} <span className="ml-1 opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-900">{filtered.length}</span>{" "}
          of {courses.length} programs
        </p>

        {(category !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
            }}
            className="text-xs font-bold text-sky-700 transition hover:text-sky-900 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {enquiryError && (
        <Alert tone="error" title="WhatsApp Enquiry Unavailable">
          {enquiryError}
        </Alert>
      )}

      {/* Course cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-7">
          {filtered.map((course, index) => {
            const photo =
              course.thumbnail ||
              siteImages.courses?.[course.id] ||
              siteImages.courses?.["basic-computer"];

            return (
              <Card
                key={course.id}
                hoverLift
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(2,132,199,0.12)]"
              >
                {/* Course image */}
                <Link
                  href={`/courses/${course.id}`}
                  aria-label={`Explore ${course.title}`}
                  className="relative block aspect-[5/3] overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-50"
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`${course.title} at ${siteConfig.name}`}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <GraduationCap className="h-16 w-16 text-sky-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-slate-950/10" />

                  {/* Top image labels */}
                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                    <span className="max-w-[75%] rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-900 shadow-sm backdrop-blur">
                      {course.category}
                    </span>

                    {course.badge && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-600 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md">
                        <Sparkles className="h-3 w-3" />
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Image bottom labels */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                        Professional Training
                      </p>
                      <p className="line-clamp-1 text-lg font-extrabold leading-tight drop-shadow sm:text-xl">
                        {course.shortTitle || course.title}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/35 px-3 py-2 text-[11px] font-semibold backdrop-blur-md">
                      <Clock3 className="h-3.5 w-3.5 text-sky-300" />
                      {course.duration || "Flexible"}
                    </span>
                  </div>
                </Link>

                {/* Main content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-extrabold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-sky-700 sm:text-xl">
                      <Link
                        href={`/courses/${course.id}`}
                        className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        {course.title}
                      </Link>
                    </h3>
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>

                  {/* Course information */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-sky-100/80 bg-sky-50/60 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Duration
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <Clock3 className="h-4 w-4 shrink-0 text-sky-600" />
                        <span className="truncate">
                          {course.duration || "Flexible"}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Skill Level
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-800">
                        {course.level || "All levels"}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  {!!course.highlights?.length && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                        What you will learn
                      </p>

                      <ul className="space-y-2.5">
                        {course.highlights.slice(0, 3).map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Career tags */}
                  {!!course.careerOpportunities?.length && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {course.careerOpportunities.slice(0, 2).map((role) => (
                        <span
                          key={role}
                          className="rounded-lg border border-sky-100 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-sky-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Fee and course hours */}
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Course Fee
                        </p>
                        <p className="mt-1 flex items-center text-2xl font-black tracking-tight text-slate-900">
                          <IndianRupee className="mr-0.5 h-5 w-5 text-sky-600" />
                          {course.fee?.replace("₹", "") || "Contact us"}
                        </p>
                      </div>

                      {course.durationHours &&
                        course.durationHours !== "To Be Decided" && (
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
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <Button
                    href={`/courses/${course.id}`}
                    variant="secondary"
                    size="sm"
                    className="min-h-10 w-full rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    View Syllabus
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleEnquire(course)}
                    className="min-h-10 w-full rounded-xl bg-green-600 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                  >
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    Enquire Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white px-5 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm ring-1 ring-sky-100">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900">
            No matching courses found
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try a different keyword or select another category to explore our programs.
          </p>
          <div className="mt-5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="rounded-xl border-sky-200 bg-white"
            >
              Reset Search & Filters
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
