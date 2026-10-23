import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CertificateSearchForm } from "@/components/verification/CertificateSearchForm";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";
import { ShieldCheck, Lock, CheckCircle2, Award, Search, KeyRound } from "lucide-react";

export const metadata = {
  title: "Online Certificate Verification",
  description: `Verify a ${siteConfig.name} computer course certificate by its serial number or the candidate's roll number.`,
  alternates: {
    canonical: `${getMetadataBase().origin}/certificate-verification`,
  },
  openGraph: {
    title: `TICE Certificate Verification | ${siteConfig.name}`,
    description: `Check a ${siteConfig.name} computer course certificate using its serial number or candidate roll number.`,
    url: `${getMetadataBase().origin}/certificate-verification`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function CertificateVerificationPage() {
  return (
    <PublicShell>
      <PageHeader
        title="Online Certificate Verification"
        subtitle="Verify the validity, completion record, and authenticity of computer course certificates issued by Talent Institute & Computer Education."
        badgeText="Official Verification Portal"
        badgeTone="sky"
        breadcrumbs={[{ label: "Verify Certificate" }]}
        image={siteImages.verification.banner}
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Verification Form Column */}
          <div className="lg:col-span-8">
            <CertificateSearchForm />
          </div>

          {/* Verification Guidelines & Security Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-[#0284c7]" aria-hidden />
                <h3>For Employers & Evaluators</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Recruitment panels, corporate employers, and academic institutions can independently authenticate candidate credentials issued by TICE.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" aria-hidden />
                  Instant confirmation against official institute database
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" aria-hidden />
                  Validates student identity, course curriculum, and issue date
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" aria-hidden />
                  Tamper-evident verification status with revocation notices
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Lock className="h-4 w-4 text-[#0284c7]" aria-hidden />
                <h3>Security & Verification Policy</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Only finalized and issued certificates are verifiable publicly. Certificates under preparation remain securely unlisted. Revoked credentials display an explicit notice.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </PublicShell>
  );
}
