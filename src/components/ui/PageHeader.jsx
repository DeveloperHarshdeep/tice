
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "./Breadcrumbs";
import { Badge } from "./Badge";
import { BookOpen, GraduationCap } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeTone = "sky",
  breadcrumbs = [],
  actions,
  image,
  className = "",
}) {
  const imageUrl =
    typeof image === "string"
      ? image.trim()
      : typeof image?.url === "string"
        ? image.url.trim()
        : "";

  const imageAlt =
    typeof image === "object" && image?.alt
      ? image.alt
      : `${title || "Course"} image`;

  const hasImage = imageUrl.length > 0;

  return (
    <section
      className={`relative isolate overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/60 py-10 sm:py-12 md:py-16 ${className}`}
    >
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl"
      />

      <Container>
        {/* Breadcrumb navigation */}
        {breadcrumbs.length > 0 && (
          <div className="relative z-10 mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div
          className={`grid items-center gap-8 lg:gap-12 ${
            hasImage
              ? "lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {/* Course information */}
          <div className="relative z-10 min-w-0">
            {badgeText && (
              <div className="mb-4">
                <Badge tone={badgeTone}>{badgeText}</Badge>
              </div>
            )}

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-sky-700">
              <GraduationCap
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <span>{`Explore ${title || "Our Course"}`}</span>
            </div>

            <h1 className="max-w-3xl break-words text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-5xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {subtitle}
              </p>
            )}

            {/* Enquiry buttons or other actions */}
            {actions && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}

            {/* Supporting trust point */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <BookOpen
                  className="h-4 w-4 text-sky-600"
                  aria-hidden="true"
                />
                Practical Learning
              </span>

              <span className="inline-flex items-center gap-2">
                <GraduationCap
                  className="h-4 w-4 text-sky-600"
                  aria-hidden="true"
                />
                Skill Development
              </span>
            </div>
          </div>

          {/* Course image */}
          {hasImage && (
            <div className="relative min-w-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl shadow-sky-900/10 sm:aspect-[5/4] lg:aspect-[4/3]">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* Bottom image caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent px-5 pb-5 pt-14 sm:px-6 sm:pb-6">
                  <p className="text-lg font-bold text-white sm:text-xl">
                    {title}
                  </p>

                  <p className="mt-1 text-sm text-white/85">
                    Learn skills. Build your future.
                  </p>
                </div>
              </div>

              {/* Small decorative accent */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 -z-10 h-24 w-24 rounded-2xl bg-sky-200/70"
              />
            </div>
          )}

          {/* Fallback when no image is provided */}
          {!hasImage && (
            <div className="mt-2 flex min-h-48 items-center justify-center rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-100 p-8 sm:min-h-56">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-sky-100">
                  <BookOpen
                    className="h-8 w-8 text-sky-600"
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Explore the course, develop practical skills, and prepare
                  for new opportunities.
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
