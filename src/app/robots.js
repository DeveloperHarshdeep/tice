import { getMetadataBase } from "@/lib/site-config";

export default function robots() {
  const base = getMetadataBase().origin;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
