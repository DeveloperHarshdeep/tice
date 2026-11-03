"use client";

import {
  ArrowRight,
  Clock3,
  Keyboard,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { typingChapters } from "@/data/typing-chapters";

const publishedChapters = typingChapters.filter((chapter) => chapter.isPublished);

function difficultyTone(difficulty) {
  if (difficulty === "Advanced") return "warning";
  if (difficulty === "Intermediate") return "aqua";
  return "success";
}

export function TypingTutorDashboard() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1500px] min-h-0 flex-col gap-3">
      <section className="flex shrink-0 flex-col gap-3 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">TICE Typing Tutor</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" aria-hidden />
              Anonymous practice · no saved attempts
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Typing Tutor
          </h1>
          <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
            Build accuracy and speed with guided lessons. Every practice
            chapter has a 10-minute timer and multiple passages.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-sky-100 bg-white px-4 py-3 sm:self-center">
          <Keyboard className="h-5 w-5 text-sky-600" aria-hidden />
          <div>
            <p className="text-lg font-bold leading-none text-slate-900">
              {publishedChapters.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-slate-500">
              chapters
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex shrink-0 flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              Practice library
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
              Choose a chapter
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            10 minutes per chapter
          </span>
        </div>

        {publishedChapters.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
            Typing chapters are not available yet. Please check back soon.
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <div className="grid gap-2.5 pb-1 sm:grid-cols-2 xl:grid-cols-3">
            {publishedChapters.map((chapter) => (
              <article
                key={chapter.id}
                className="group flex min-h-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-all hover:border-sky-200 hover:shadow-sm sm:p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-bold text-sky-700">
                      {String(chapter.chapterNumber).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold leading-5 text-slate-900">
                        {chapter.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-600">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                  <Badge tone={difficultyTone(chapter.difficulty)}>
                    {chapter.difficulty}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                  <span>{chapter.paragraphs.length} passages</span>
                  {chapter.targetWPM > 0 && (
                    <span>Target {chapter.targetWPM} WPM</span>
                  )}
                  {chapter.targetAccuracy > 0 && (
                    <span>Target {chapter.targetAccuracy}% accuracy</span>
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    href={`/typing-tutor/${chapter.id}`}
                    size="sm"
                    className="w-full justify-between !min-h-8 !py-1 !text-xs"
                  >
                    Start practice
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </article>
            ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
