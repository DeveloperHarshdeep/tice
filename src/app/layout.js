import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, getMetadataBase } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${siteConfig.name} | Computer Training & Certification`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.tagline,
  keywords: [
    "computer institute",
    "Tally with GST",
    "DCA diploma",
    "computer classes",
    "certificate verification",
    "web design course",
    "Python programming basics",
    "student results",
  ],
  authors: [{ name: siteConfig.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Practical Computer Training`,
    description: siteConfig.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.shortName} - Computer Education`,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-sky-200 selection:text-sky-950">
        {children}
      </body>
    </html>
  );
}
