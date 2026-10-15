"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { courses } from "@/data/courses";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm({ defaultCourse = "" }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    courseOfInterest: defaultCourse,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle" });

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateClient() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!form.phone.trim() && !form.email.trim()) {
      next.phone = "Please provide either a phone number or email address.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (form.message.trim().length < 10) {
      next.message = "Message should be at least 10 characters long.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateClient()) return;

    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({
          type: "error",
          message: json.error?.message || "Enquiry submission failed. Please try again.",
        });
        return;
      }
      setStatus({
        type: "success",
        message: "Thank you! Your admission enquiry has been recorded. Our counsellor will contact you shortly.",
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        courseOfInterest: defaultCourse,
        message: "",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Could not connect to the server. Please check your internet connection.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Input
        label="Full Name *"
        name="name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
        placeholder="e.g. Ramesh Kumar"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          error={errors.phone}
          placeholder="e.g. 98765 43210"
          helperText="Preferred for quick WhatsApp / SMS updates"
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          placeholder="e.g. name@example.com"
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label
          htmlFor="courseOfInterest"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Course of Interest
        </label>
        <select
          id="courseOfInterest"
          name="courseOfInterest"
          value={form.courseOfInterest}
          onChange={(e) => updateField("courseOfInterest", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-sm text-foreground transition-colors focus:border-brand-sky focus:outline-none focus:ring-2 focus:ring-brand-sky/30 hover:border-slate-300"
        >
          <option value="">-- Select a Course (or general enquiry) --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title} ({c.duration})
            </option>
          ))}
          <option value="General Admission Enquiry">General Admission Enquiry / Batch Timings</option>
        </select>
      </div>

      <Textarea
        label="Message / Learning Goals *"
        name="message"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        error={errors.message}
        placeholder="Tell us about your educational background, preferred batch timing (morning/evening), or specific questions..."
        required
      />

      {status.type === "error" ? (
        <Alert tone="error" title="Submission Notice">
          {status.message}
        </Alert>
      ) : null}

      {status.type === "success" ? (
        <Alert tone="success" title="Enquiry Successfully Sent">
          {status.message}
        </Alert>
      ) : null}

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={status.type === "loading"}
          className="w-full sm:w-auto"
        >
          {status.type === "loading" ? (
            <Spinner label="Submitting enquiry…" size="sm" />
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Submit Admission Enquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
