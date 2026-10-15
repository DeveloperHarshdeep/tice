import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "./Breadcrumbs";
import { Badge } from "./Badge";

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
  return (
    <section
      className={`relative overflow-hidden border-b border-sky-100 bg-gradient-to-b from-sky-50/60 via-white to-white py-12 md:py-16 ${className}`}
    >
      {/* Subtle top ambient accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-sky to-transparent opacity-80" />
      <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl -z-10" />

      <Container>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className={image ? "lg:col-span-7" : "max-w-3xl"}>
            {badgeText ? (
              <div className="mb-3">
                <Badge tone={badgeTone}>{badgeText}</Badge>
              </div>
            ) : null}
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            ) : null}

            {actions ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            ) : null}
          </div>

          {image ? (
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg shadow-sky-950/10">
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
