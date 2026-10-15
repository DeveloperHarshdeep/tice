import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getMetadataBase } from "@/lib/site-config";

export function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const base = getMetadataBase().origin;

  const schemaItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: base,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: item.href ? `${base}${item.href}` : undefined,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-foreground-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-brand transition-colors text-slate-500 hover:text-slate-800"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" aria-hidden />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.label + idx} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" aria-hidden />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-brand transition-colors text-slate-500 hover:text-slate-800"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
