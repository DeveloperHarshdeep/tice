import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ResultSearchForm } from "@/components/results/ResultSearchForm";
import { siteConfig, getMetadataBase } from "@/lib/site-config";
import { siteImages } from "@/data/images";
import { ShieldCheck, Search, Info, HelpCircle, FileCheck2, Award } from "lucide-react";

export const metadata = {
  title: "Student Examination Results",
  description: `Search and verify published student examination results by roll number at ${siteConfig.name} (TICE).`,
  alternates: {
    canonical: `${getMetadataBase().origin}/results`,
  },
  openGraph: {
    title: `Student Results Portal | ${siteConfig.name}`,
    description: `Search and verify published student examination results by roll number at ${siteConfig.name}.`,
    url: `${getMetadataBase().origin}/results`,
  },
};

export default function ResultsPage() {
  return (
    <PublicShell>
      <PageHeader
        title="Student Examination Results"
        subtitle="Search published examination scores, subject evaluation, aggregate percentages, and performance grades by entering your assigned student roll number."
        badgeText="Official Results Portal"
        badgeTone="sky"
        breadcrumbs={[{ label: "Result" }]}
        image={siteImages.results.banner}
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Search & Results Column */}
          <div className="lg:col-span-8">
            <ResultSearchForm />
          </div>

          {/* Guidelines & Information Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-xs uppercase tracking-wider">
                <Search className="h-4 w-4 text-[#0284c7]" aria-hidden />
                <h3>How to Query Your Scorecard</h3>
              </div>
              <ol className="mt-3 space-y-2.5 text-xs sm:text-sm text-slate-600 list-decimal pl-4 leading-relaxed">
                <li>Locate the roll number assigned on your admission confirmation or exam hall ticket.</li>
                <li>Enter the full roll number into the search field and submit.</li>
                <li>Your verified statement of marks and grade will render automatically.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                <h3>Evaluation Integrity Policy</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Only finalized and officially published examination records are accessible via this public lookup. Results under internal review remain protected. Private personal records are strictly masked from public display.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </PublicShell>
  );
}
