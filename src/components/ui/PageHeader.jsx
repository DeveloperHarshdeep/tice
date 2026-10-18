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
  // ---- Normalize inputs -------------------------------------------------
  const titleText = typeof title === "string" ? title.trim() : "";

  const imageUrl =
    typeof image === "string"
      ? image.trim()
      : image && typeof image === "object" && typeof image.url === "string"
        ? image.url.trim()
        : "";

  const customAlt =
    image && typeof image === "object" && typeof image.alt === "string"
      ? image.alt.trim()
      : "";

  const imageAlt =
    customAlt || (titleText ? `${titleText} course image` : "Course image");

  const hasImage = imageUrl.length > 0;
  const crumbs = Array.isArray(breadcrumbs) ? breadcrumbs : [];
  const hasCrumbs = crumbs.length > 0;

  const sectionClasses = [
    "relative isolate overflow-hidden border-b border-sky-100 bg-gradient-to-b from-sky-50/70 via-white to-white py-8 sm:py-12 lg:py-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClasses}>
      {/* Decorative: top accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500"
      />

      {/* Decorative: soft corner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 100% 0%, rgba(186,230,253,0.55), rgba(186,230,253,0) 70%)",
        }}
      />

      {/* Decorative: dot grid, only for the text-only variant on large screens */}
      {!hasImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/3 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(rgba(14,165,233,0.22) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,0.9), rgba(0,0,0,0))",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,0.9), rgba(0,0,0,0))",
          }}
        />
      )}

      <Container>
        {/* Breadcrumb navigation */}
        {hasCrumbs && (
          <div className="relative z-10 mb-6 sm:mb-8">
            <Breadcrumbs items={crumbs} />
          </div>
        )}

        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
              : "grid grid-cols-1"
          }
        >
          {/* ---------- Text column ---------- */}
          <div className={`relative z-10 min-w-0 ${hasImage ? "" : "max-w-3xl"}`}>
            {/* Badge + eyebrow */}
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {badgeText && <Badge tone={badgeTone}>{badgeText}</Badge>}

              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                <span
                  aria-hidden="true"
                  className="h-px w-8 shrink-0 bg-sky-400"
                />
                <span>Talent Institute &amp; Computer Education</span>
              </p>
            </div>

            <h1 className="break-words text-3xl font-extrabold leading-[1.15] tracking-tight text-sky-950 sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
                {subtitle}
              </p>
            )}

            {/* Enquiry buttons or other actions */}
            {actions && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}

            {/* Trust indicators */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sky-100 pt-5 text-sm font-medium text-slate-600">
              <li className="inline-flex items-center gap-2">
                <BookOpen
                  className="h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                Practical Learning
              </li>
              <li className="inline-flex items-center gap-2">
                <GraduationCap
                  className="h-4 w-4 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                Skill Development
              </li>
            </ul>
          </div>

          {/* ---------- Image column ---------- */}
          {hasImage && (
            <div className="relative min-w-0">
              {/* Decorative offset outline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 -right-3 -z-10 hidden h-full w-full rounded-xl border border-sky-200 bg-sky-50/60 sm:block"
              />

              {/* Framed image */}
              <div className="rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl shadow-sky-950/10 sm:p-2">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-sky-50 sm:aspect-[4/3]">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Frosted caption chip */}
                  <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto">
                    <div className="inline-flex max-w-full items-center gap-3 rounded-lg border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-md shadow-slate-950/10 backdrop-blur">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky-600 text-white"
                      >
                        <GraduationCap className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                          TICE
                        </span>
                        <span className="block truncate text-sm font-semibold text-sky-950">
                          Learn skills. Build your future.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}