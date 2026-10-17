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

function TiceLogo({ size = "md" }) {
  const sizeClasses =
    size === "lg" ? "h-12 w-12 sm:h-14 sm:w-14" : "h-9 w-9";

  return (
    <span
      className={`flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white`}
    >
      <img
        src="/tice_logo.png"
        alt="Talent Institute & Computer Education logo"
        className="block h-full w-full object-contain"
      />
    </span>
  );
}

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
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-5 md:hidden">
        <Link
          href="/admin/dashboard"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="TICE Admin Dashboard"
        >
          <TiceLogo />
          <span className="truncate text-sm font-bold text-slate-900">
            TICE Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-3 shrink-0 rounded-lg border border-border p-2 text-slate-700 transition-colors hover:bg-slate-50"
          aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </header>

      {/* Responsive Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } w-full border-b border-border bg-white md:block md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r`}
      >
        {/* Desktop Logo and Branding */}
        <div className="hidden border-b border-slate-100 p-5 md:block">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
            aria-label="TICE Admin Dashboard"
          >
            <TiceLogo size="lg" />

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {siteConfig.shortName}
              </p>
              <p className="text-[11px] font-medium text-brand">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        {/* User Session Info */}
        <div className="mx-3 mt-4 flex items-center gap-2.5 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-xs">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-xs font-bold text-sky-950">
              {sessionUser?.email || "Administrator"}
            </p>
            <p className="text-[10px] text-sky-700">
              Authenticated Session
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-col gap-1 p-3"
          aria-label="Admin navigation"
        >
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
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-sky-100/80 text-brand-dark shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-brand" : "text-slate-400"
                  }`}
                  aria-hidden
                />
                <span>{label}</span>
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
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                aria-hidden
              />
              Public Website
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger transition-colors hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  );
}
