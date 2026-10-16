"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

// Exactly the requested 5 menu items: Home, Courses, Verify Certificate, Result, About
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/certificate-verification", label: "Verify Certificate" },
  { href: "/results", label: "Result" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile nav on route change
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Detect scroll for subtle header elevation
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Escape key to close mobile nav
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-sky-100 bg-white/95 backdrop-blur-md shadow-xs shadow-sky-500/5"
          : "border-b border-slate-100 bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Top Institutional Trust Strip */}
      <div className="hidden border-b border-sky-100/70 bg-gradient-to-r from-sky-50/60 via-white to-cyan-50/60 py-1.5 text-xs text-slate-600 sm:block">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-sky"></span>
              </span>
              <span className="font-semibold text-slate-900">TICE</span> · Talent Institute & Computer Education · Admissions Open
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/certificate-verification"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-brand transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden />
              <span>Verify Certificate</span>
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/results"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-brand transition-colors"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-slate-500" aria-hidden />
              <span>Student Results</span>
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <UserCheck className="h-3 w-3" aria-hidden />
              <span>Staff Login</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Header Bar */}
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-foreground group"
        >
          <span className="flex h-30 w-30 shrink-0 items-center justify-center overflow-hidden rounded-lg">
  <img
    src="/tice_logo.png"
    alt="TICE Logo"
    className="h-full w-full object-contain"
  />
</span>
          <div className="flex flex-col">
            {/* <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-brand transition-colors">
                TICE
              </span>
              <span className="rounded bg-sky-100/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-900">
                Institute
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-slate-500 hidden sm:inline">
              Talent Institute & Computer Education
            </span> */}
          </div>
        </Link>

        {/* Desktop Navigation: Exactly Home, Courses, Verify Certificate, Result, About */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-sky-900 bg-sky-100/70 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-brand-sky" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button
              href="/contact"
              size="sm"
              variant="primary"
              className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-semibold shadow-xs shadow-sky-500/20"
            >
              Enquire for Batch
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-border p-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-sky lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Drawer: Exactly Home, Courses, Verify Certificate, Result, About */}
      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-sky-100 bg-white shadow-xl lg:hidden animate-fade-in"
          aria-label="Mobile navigation"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-sky-50 text-sky-950 border border-sky-200/80 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span className="h-2 w-2 rounded-full bg-brand-sky" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </Link>
              );
            })}

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Button
                href="/contact"
                className="w-full justify-center bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white"
                onClick={() => setOpen(false)}
              >
                Enquire for Batch
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5" aria-hidden />
                Staff Administration Portal
              </Link>
            </div>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
