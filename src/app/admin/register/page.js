import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminRegistrationEnabled } from "@/lib/admin-settings";
import { AdminRegistrationForm } from "@/components/admin/AdminRegistrationForm";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/site-config";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrator Registration",
  description: `Register an administrator account for ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

export default async function AdminRegistrationPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  const registrationEnabled = await getAdminRegistrationEnabled();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand"
        >
          <GraduationCap className="h-5 w-5" aria-hidden />
          {siteConfig.shortName} Administration
        </Link>
        <Card className="border-sky-200/80 bg-white p-8 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Register Administrator
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Create a staff account for the shared management portal.
            </p>
          </div>
          {registrationEnabled ? (
            <AdminRegistrationForm />
          ) : (
            <div className="space-y-5 text-center">
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                Administrator registration is currently closed. Please contact
                an existing administrator.
              </p>
              <Link
                href="/admin/login"
                className="text-sm font-semibold text-brand hover:underline"
              >
                Return to administrator sign in
              </Link>
            </div>
          )}
          {registrationEnabled ? (
            <p className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link
                href="/admin/login"
                className="font-semibold text-brand hover:underline"
              >
                Sign in
              </Link>
            </p>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
