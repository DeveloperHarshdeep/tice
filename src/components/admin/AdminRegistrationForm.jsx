"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export function AdminRegistrationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setError(result.error?.message || "Unable to register administrator.");
        return;
      }

      setSuccess("Administrator account created. You can now sign in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch {
      setError("Unable to complete registration. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Input
        label="Full name *"
        name="name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        minLength={2}
        maxLength={120}
      />
      <Input
        label="Administrator email *"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        maxLength={255}
      />
      <Input
        label="Password *"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={8}
        maxLength={128}
      />
      <Input
        label="Confirm password *"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        minLength={8}
        maxLength={128}
      />
      {error ? (
        <Alert tone="error" title="Registration Failed">
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert tone="success" title="Registration Complete">
          {success}
        </Alert>
      ) : null}
      <Button
        type="submit"
        className="w-full justify-center"
        size="lg"
        disabled={loading}
      >
        {loading ? <Spinner label="Creating account…" size="sm" /> : "Create administrator account"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        <Link href="/admin/login" className="font-semibold text-brand hover:underline">
          Back to administrator sign in
        </Link>
      </p>
    </form>
  );
}
