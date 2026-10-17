
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
  Clock,
  ArrowRight,
  Check,
  X,
  IndianRupee,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [enquiryError, setEnquiryError] = useState("");

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        category === "all" || course.category === category;

      const q = query.trim().toLowerCase();

      if (!q) return matchesCategory;

      const inTitle = course.title.toLowerCase().includes(q);
      const inDesc = course.description.toLowerCase().includes(q);
      const inHighlights = (course.highlights || []).some((item) =>
        item.toLowerCase().includes(q)
      );
      const inCareer = (course.careerOpportunities || []).some((item) =>
        item.toLowerCase().includes(q)
      );

      return (
        matchesCategory &&
        (inTitle || inDesc || inHighlights || inCareer)
      );
    });
  }, [query, category]);

  // Open WhatsApp with the selected course details.
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

    const whatsappUrl = createWhatsAppUrl(message, siteConfig.contact.phone);
    if (!whatsappUrl) {
      setEnquiryError(
        "The institute's WhatsApp number is missing or invalid. Please contact the institute by phone or email.",
      );
      return;
    }

    setEnquiryError("");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col gap-4 border-b border-sky-100 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <Input
            name="course-search"
            aria-label="Search courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, skills, tools..."
            className="border-sky-200 pl-10 pr-9 focus:border-[#0284c7] focus:ring-sky-500/20"
          />

          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Course categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={category === "all"}
            onClick={() => setCategory("all")}
            className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              category === "all"
                ? "bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-sm shadow-sky-500/20"
                : "border border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/50"
            }`}
          >
            All Programs ({courses.length})
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
                className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  category === cat
                    ? "bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-sm shadow-sky-500/20"
                    : "border border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filtered.length}</strong> of {courses.length} courses
        </span>

        {category !== "all" || query ? (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
            }}
            className="font-bold text-[#0284c7] hover:underline"
          >
            Reset search and filters
          </button>
        ) : null}
      </div>

      {enquiryError ? (
        <Alert tone="error" title="WhatsApp Enquiry Unavailable">
          {enquiryError}
        </Alert>
      ) : null}

      {/* Course Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const photo =
            siteImages.courses[course.id] ||
            siteImages.courses["basic-computer"];

          return (
            <Card
              key={course.id}
              hoverLift
              className="group flex flex-col justify-between overflow-hidden border-sky-100 bg-white shadow-sm"
            >
              <div>
                {/* Course Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  <div className="absolute left-3 top-3">
                    <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-950 backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Clock
                        className="h-3.5 w-3.5 text-sky-300"
                        aria-hidden="true"
                      />
                      {course.duration}
                    </span>

                    <span className="rounded bg-sky-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6">
                  <h2 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#0284c7]">
                    <Link href={`/courses/${course.id}`}>
                      {course.title}
                    </Link>
                  </h2>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {course.description}
                  </p>

                  {/* Course Fee */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/60 px-3.5 py-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Course Fee
                      </p>
                      <p className="mt-0.5 text-xl font-extrabold text-slate-900">
                        {course.fee || "Contact for fee"}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0284c7] shadow-sm">
                      <IndianRupee
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Duration and Learning Hours */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                      Duration: {course.duration}
                    </span>

                    {course.durationHours ? (
                      <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                        {course.durationHours}
                      </span>
                    ) : null}
                  </div>

                  {/* Core Topics */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Core Topics
                    </p>

                    <ul className="space-y-1 text-xs text-slate-600">
                      {(course.highlights || [])
                        .slice(0, 3)
                        .map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-1.5"
                          >
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0284c7]"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Career Opportunities */}
                  {course.careerOpportunities?.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {course.careerOpportunities
                        .slice(0, 2)
                        .map((role) => (
                          <span
                            key={role}
                            className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-900"
                          >
                            {role}
                          </span>
                        ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Actions */}
              <div className="border-t border-slate-100 p-6 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    href={`/courses/${course.id}`}
                    variant="secondary"
                    size="sm"
                    className="w-full border-sky-200 text-xs font-semibold hover:bg-sky-50"
                  >
                    Syllabus
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleEnquire(course)}
                    className="w-full bg-[#16a34a] text-xs font-semibold text-white hover:bg-[#15803d]"
                  >
                    <MessageCircle
                      className="mr-1.5 h-4 w-4"
                      aria-hidden="true"
                    />
                    Enquire
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 py-16 text-center">
          <BookOpen
            className="mx-auto h-10 w-10 text-sky-300"
            aria-hidden="true"
          />

          <h3 className="mt-3 text-base font-bold text-slate-900">
            No courses match &ldquo;{query}&rdquo;
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Try searching for broader terms such as Office, Tally, or reset
            the category filter.
          </p>

          <div className="mt-5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="border-sky-200"
            >
              Reset Search &amp; Filters
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
