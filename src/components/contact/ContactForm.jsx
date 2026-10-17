
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { courses } from "@/data/courses";
import { siteConfig } from "@/lib/site-config";
import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl, getWhatsAppNumber } from "@/lib/whatsapp";

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

  const whatsappNumber = getWhatsAppNumber(siteConfig.contact.phone);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (status.type !== "idle") {
      setStatus({ type: "idle" });
    }
  }

  function validateClient() {
    const next = {};

    if (form.name.trim().length < 2) {
      next.name = "Please enter your full name.";
    }

    if (!form.phone.trim() && !form.email.trim()) {
      next.phone = "Please provide either a phone number or email address.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      next.email = "Please enter a valid email address.";
    }

    if (form.message.trim().length < 10) {
      next.message = "Message should be at least 10 characters long.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validateClient()) return;

    if (!whatsappNumber) {
      setStatus({
        type: "error",
        message:
          "The institute's WhatsApp number is missing or invalid. Please contact the institute by phone or email.",
      });
      return;
    }

    const course = courses.find(
      (item) =>
        item.title === form.courseOfInterest ||
        item.id === form.courseOfInterest,
    );
    const generalEnquiry =
      !form.courseOfInterest ||
      form.courseOfInterest === "General Admission Enquiry";
    const courseName = course?.title || form.courseOfInterest;

    const message = [
      `Hello ${siteConfig.name}!`,
      "",
      generalEnquiry ? "General Admission Enquiry" : "Course Enquiry",
      "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim() || "Not provided"}`,
      `Email: ${form.email.trim() || "Not provided"}`,
      `Course: ${generalEnquiry ? "Not specified" : courseName}`,
      ...(course?.fee ? [`Course Fee: ${course.fee}`] : []),
      "",
      "My enquiry:",
      form.message.trim(),
      "",
      "Please share further details about admission and batch timings.",
    ].join("\n");

    const url = createWhatsAppUrl(message, siteConfig.contact.phone);

    if (!url) {
      setStatus({
        type: "error",
        message:
          "The institute's WhatsApp number is missing or invalid. Please contact the institute by phone or email.",
      });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setStatus({
      type: "success",
      message:
        "Your enquiry is ready in WhatsApp. Review the message and tap Send; if WhatsApp does not open, allow pop-ups and try again.",
    });
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
          helperText="Used for admission follow-up"
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
          onChange={(e) =>
            updateField("courseOfInterest", e.target.value)
          }
          className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-sm text-foreground transition-colors hover:border-slate-300 focus:border-brand-sky focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
        >
          <option value="">
            -- Select a Course (or general enquiry) --
          </option>

          {courses.map((course) => (
            <option key={course.id} value={course.title}>
              {course.title} ({course.duration})
              {course.fee ? ` - ${course.fee}` : ""}
            </option>
          ))}

          <option value="General Admission Enquiry">
            General Admission Enquiry / Batch Timings
          </option>
        </select>
      </div>

      <Textarea
        label="Message / Learning Goals *"
        name="message"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        error={errors.message}
        placeholder="Tell us about your educational background, preferred batch timing, or questions about the course..."
        required
      />

      {status.type === "error" ? (
        <Alert tone="error" title="Enquiry Notice">
          {status.message}
        </Alert>
      ) : null}

      {status.type === "success" ? (
        <Alert tone="success" title="WhatsApp Enquiry Ready">
          {status.message}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          className="w-full bg-[#16a34a] text-white hover:bg-[#15803d] sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Send Enquiry via WhatsApp
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        WhatsApp opens with a pre-filled message for you to review and send
        directly to the institute. Your enquiry is not stored on this website.
      </p>
    </form>
  );
}
