import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Container } from "@/components/layout/Container";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50/60 md:flex">
      <AdminSidebar sessionUser={session} />
      <main className="flex-1 overflow-x-hidden">
        <Container className="py-8 md:py-10 max-w-6xl">{children}</Container>
      </main>
    </div>
  );
}
