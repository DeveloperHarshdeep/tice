"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { siteConfig } from "@/lib/site-config";
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error?.message || "Invalid administrative email or password.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Unable to complete sign-in. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-sky-200/80 bg-white p-8 shadow-md">
      {/* Brand Header */}
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-sky via-brand to-brand-dark text-white shadow-xs">
          <GraduationCap className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
          Administrator Sign In
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {siteConfig.shortName} · Management Portal
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Input
          label="Administrator Email *"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-foreground"
            >
              Password *
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" aria-hidden />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                  Show
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground transition-colors focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20 hover:border-slate-300"
            />
          </div>
        </div>

        {error ? (
          <Alert tone="error" title="Authentication Failed">
            {error}
          </Alert>
        ) : null}

        <Button
          type="submit"
          className="w-full justify-center mt-2"
          size="lg"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <Spinner label="Authenticating session…" size="sm" />
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden />
              Sign In to Admin Portal
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Protected by HTTPS & Encrypted Session Cookies
        </span>
      </div>
    </Card>
  );
}
