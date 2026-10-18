import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IndianRupee,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { courses } from "@/data/courses";
import { siteImages } from "@/data/images";
import { siteConfig } from "@/lib/site-config";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import './HomeCourseCarouse.css'
const featuredCourses = courses.slice(0, 5);

function CourseCard({ course }) {
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

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(2,132,199,0.12)]">
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
            sizes="(max-width: 639px) 82vw, (max-width: 1023px) 48vw, 31vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-16 w-16 text-sky-300" aria-hidden />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-slate-950/10" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="max-w-[75%] rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-900 shadow-sm backdrop-blur">
            {course.category}
          </span>
          {course.badge && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-600 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md">
              <Sparkles className="h-3 w-3" aria-hidden />
              {course.badge}
            </span>
          )}
        </div>

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
            <Clock3 className="h-3.5 w-3.5 text-sky-300" aria-hidden />
            {course.duration || "Flexible"}
          </span>
        </div>
      </Link>

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
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-slate-500">
          {course.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-2xl border border-sky-100/80 bg-sky-50/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Duration
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <Clock3 className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
              <span className="truncate">{course.duration || "Flexible"}</span>
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

        {!!course.highlights?.length && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              What you will learn
            </p>
            <ul className="space-y-2.5">
              {course.highlights.slice(0, 2).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-sky-600"
                    aria-hidden
                  />
                  <span className="line-clamp-2">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Course Fee
              </p>
              <p className="mt-1 flex items-center text-xl font-black tracking-tight text-slate-900">
                <IndianRupee
                  className="mr-0.5 h-4 w-4 text-sky-600"
                  aria-hidden
                />
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

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">
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
            <MessageCircle className="h-4 w-4" aria-hidden />
            Enquire
          </a>
        ) : (
          <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-200 px-3 py-1.5 text-center text-xs font-bold text-slate-600">
            Enquire by phone
          </span>
        )}
      </div>
    </article>
  );
}

function CourseSequence({ duplicate = false }) {
  return (
    <div
      className="home-course-carousel__sequence"
      aria-hidden={duplicate ? "true" : undefined}
      inert={duplicate || undefined}
    >
      {featuredCourses.map((course) => (
        <div className="home-course-carousel__slide" key={course.id}>
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}

export function HomeCoursesCarousel() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
            Learn in-demand skills
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Practical training programs designed to build skills for your next
            career step.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-800 shadow-xs transition hover:border-sky-300 hover:bg-sky-50 sm:self-auto"
        >
          Show All Courses
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {featuredCourses.length > 0 ? (
        <div
          className="home-course-carousel overflow-hidden"
          role="region"
          aria-label="Featured courses carousel"
        >
          <div className="home-course-carousel__track">
            <CourseSequence />
            <CourseSequence duplicate />
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600">
          Course information is currently unavailable.
        </p>
      )}

      <div className="mt-7 flex justify-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-sky-500"
        >
          Browse All Courses
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
