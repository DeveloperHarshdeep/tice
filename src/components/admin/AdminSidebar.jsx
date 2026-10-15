"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Award,
  ClipboardList,
  LogOut,
  GraduationCap,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/students", label: "Students", icon: Users },
  { href: "/admin/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/admin/dashboard/results", label: "Results", icon: ClipboardList },
];

export function AdminSidebar({ sessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-white px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCap className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-bold text-slate-900 text-sm">
            TICE Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-border p-2 text-slate-700"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop always, Mobile conditional) */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block md:w-64 md:shrink-0 md:min-h-screen border-b md:border-b-0 md:border-r border-border bg-white`}
      >
        <div className="p-5 border-b border-slate-100 hidden md:block">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-sky via-brand to-brand-dark text-white shadow-xs">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">{siteConfig.shortName}</p>
              <p className="text-[11px] font-medium text-brand">Admin Console</p>
            </div>
          </Link>
        </div>

        {/* User Session Info Pill */}
        <div className="mx-3 mt-4 rounded-xl bg-sky-50/70 p-3 border border-sky-100 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand shadow-xs">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-sky-950 truncate">
              {sessionUser?.email || "Administrator"}
            </p>
            <p className="text-[10px] text-sky-700">Authenticated Session</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 p-3" aria-label="Admin navigation">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Management
          </p>
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-sky-100/80 text-brand-dark shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-brand" : "text-slate-400"}`}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-slate-100" />

          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Shortcuts
          </p>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              Public Website
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger hover:bg-red-50 transition-colors cursor-pointer mt-2"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  );
}
