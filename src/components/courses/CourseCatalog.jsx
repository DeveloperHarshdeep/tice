"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { courses, courseCategories } from "@/data/courses";
import { siteImages } from "@/data/images";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Check,
  X,
  Layers,
  Laptop,
} from "lucide-react";

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === "all" || course.category === category;
      const q = query.trim().toLowerCase();
      if (!q) return matchesCategory;

      const inTitle = course.title.toLowerCase().includes(q);
      const inDesc = course.description.toLowerCase().includes(q);
      const inHighlights = course.highlights.some((h) =>
        h.toLowerCase().includes(q)
      );
      const inCareer = (course.careerOpportunities || []).some((c) =>
        c.toLowerCase().includes(q)
      );

      return matchesCategory && (inTitle || inDesc || inHighlights || inCareer);
    });
  }, [query, category]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-sky-100 pb-6">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            name="course-search"
            aria-label="Search courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, skills, tools (e.g. Tally, Excel, Python)..."
            className="pl-10 pr-9 border-sky-200 focus:border-[#0284c7] focus:ring-sky-500/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category Filter Pills */}
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
                ? "bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-xs shadow-sky-500/20"
                : "border border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/50"
            }`}
          >
            All Programs ({courses.length})
          </button>
          {courseCategories.map((cat) => {
            const count = courses.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={category === cat}
                onClick={() => setCategory(cat)}
                className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  category === cat
                    ? "bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-xs shadow-sky-500/20"
                    : "border border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status Bar */}
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
            className="text-[#0284c7] font-bold hover:underline"
          >
            Reset search and filters
          </button>
        ) : null}
      </div>

      {/* Image-Rich Courses Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const photo = siteImages.courses[course.id] || siteImages.courses["basic-computer"];
          return (
            <Card
              key={course.id}
              hoverLift
              className="flex flex-col justify-between overflow-hidden border-sky-100 bg-white shadow-xs group"
            >
              <div>
                {/* Course Image Header with Controlled 16:10 Ratio & Hover Zoom */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-950 backdrop-blur-xs">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold drop-shadow-xs">
                      <Clock className="h-3.5 w-3.5 text-sky-300" aria-hidden />
                      {course.duration}
                    </span>
                    <span className="rounded bg-sky-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug">
                    <Link href={`/courses/${course.id}`}>
                      {course.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Core Topics Checklist */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Core Topics
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {course.highlights.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0284c7]" aria-hidden />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Outcomes */}
                  {course.careerOpportunities && course.careerOpportunities.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {course.careerOpportunities.slice(0, 2).map((role) => (
                        <span
                          key={role}
                          className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-900 border border-sky-100"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="p-6 pt-0 border-t border-slate-100">
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    href={`/courses/${course.id}`}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold border-sky-200 hover:bg-sky-50"
                  >
                    Syllabus
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </Button>
                  <Button
                    href={`/contact?course=${encodeURIComponent(course.title)}`}
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-semibold bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white"
                  >
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
          <BookOpen className="mx-auto h-10 w-10 text-sky-300" aria-hidden />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            No courses match &ldquo;{query}&rdquo;
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Try searching for broader terms such as &ldquo;Office&rdquo;, &ldquo;Tally&rdquo;, or reset the category filter.
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
              Reset Search & Filters
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
