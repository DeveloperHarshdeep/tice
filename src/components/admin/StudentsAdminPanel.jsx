"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/data/courses";
import { adminFetch, uploadFile } from "@/lib/admin-fetch";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Upload,
  User,
  Calendar,
  BookOpen,
  Phone,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const emptyForm = {
  rollNumber: "",
  fullName: "",
  fatherName: "",
  contactNumber: "",
  courseId: courses[0]?.id || "basic-computer",
  courseName: courses[0]?.title || "Basic Computer Course",
  enrollmentDate: "",
};

export function StudentsAdminPanel() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch(`/api/admin/students?q=${encodeURIComponent(q)}`);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  }

  function handleCourseChange(courseId) {
    const matched = courses.find((c) => c.id === courseId);
    setForm((f) => ({
      ...f,
      courseId,
      courseName: matched?.title || courseId,
    }));
  }

  function startEdit(student) {
    setEditingId(student._id || student.id);
    setForm({
      rollNumber: student.rollNumber,
      fullName: student.fullName,
      fatherName: student.fatherName,
      contactNumber: student.contactNumber || "",
      courseId: student.courseId || "basic-computer",
      courseName: student.courseName || "",
      enrollmentDate: student.enrollmentDate
        ? new Date(student.enrollmentDate).toISOString().slice(0, 10)
        : "",
    });
    setPhotoFile(null);
    setPhotoPreview(student.photo?.url || student.imageUrl || null);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError("");
  }

  async function saveStudent(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!form.rollNumber.trim()) {
      setError("Roll number is required.");
      setSaving(false);
      return;
    }
    if (!form.fullName.trim()) {
      setError("Student name is required.");
      setSaving(false);
      return;
    }
    if (!form.fatherName.trim()) {
      setError("Father's name is required.");
      setSaving(false);
      return;
    }
    if (!form.contactNumber.trim()) {
      setError("Contact number is required.");
      setSaving(false);
      return;
    }

    try {
      let photo;
      if (photoFile) {
        const uploaded = await uploadFile(photoFile, "talent-institute/students");
        photo = { url: uploaded.url, publicId: uploaded.publicId };
      }

      const payload = {
        ...form,
        rollNumber: form.rollNumber.trim().toUpperCase(),
        enrollmentDate: form.enrollmentDate || undefined,
        ...(photo ? { photo, imageUrl: photo.url } : {}),
      };

      if (editingId) {
        await adminFetch(`/api/admin/students/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess(`Student record for ${payload.fullName} updated successfully.`);
      } else {
        await adminFetch("/api/admin/students", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess(`Student ${payload.fullName} (${payload.rollNumber}) registered successfully.`);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message || "Failed to save student record.");
    } finally {
      setSaving(false);
    }
  }

  async function removeStudent(id, name) {
    if (
      !confirm(
        `Are you sure you want to delete or archive student "${name}"? If the student has certificates or published results, they will be safely archived instead of deleted.`
      )
    )
      return;
    try {
      await adminFetch(`/api/admin/students/${id}`, { method: "DELETE" });
      setSuccess(`Student "${name}" processed.`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Manage Students
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enrol students, assign roll numbers, upload profile photos to Cloudinary, and manage student records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="sky">{items.length} Registered Students</Badge>
        </div>
      </div>

      {error ? (
        <Alert tone="error" title="Notice">
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert tone="success" title="Success">
          {success}
        </Alert>
      ) : null}

      {/* Registration / Edit Form Card */}
      <Card className="border-sky-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {editingId ? (
                <>
                  <Pencil className="h-4 w-4 text-[#0284c7]" aria-hidden />
                  Edit Student Information
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 text-[#0284c7]" aria-hidden />
                  Register New Student
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in all mandatory fields marked with an asterisk (*).
            </p>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-[#0284c7] hover:underline"
            >
              Cancel Edit & Add New
            </button>
          ) : null}
        </div>

        <form onSubmit={saveStudent} className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            label="Roll Number *"
            value={form.rollNumber}
            onChange={(e) => setForm({ ...form, rollNumber: e.target.value.toUpperCase() })}
            placeholder="e.g. TICE/2026/001"
            required
            helperText="Unique institutional identifier (case-insensitive)"
          />

          <Input
            label="Student Full Name *"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="e.g. Rahul Verma"
            required
          />

          <Input
            label="Father's Name *"
            value={form.fatherName}
            onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
            placeholder="e.g. Suresh Verma"
            required
            helperText="Internal institutional record. Never displayed on public results."
          />

          <Input
            label="Contact Number *"
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="e.g. 9876543210"
            required
            helperText="10-digit mobile or WhatsApp number"
          />

          <Select
            label="Enrolled Course *"
            value={form.courseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            required
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level})
              </option>
            ))}
          </Select>

          <Input
            label="Admission / Enrollment Date"
            type="date"
            value={form.enrollmentDate}
            onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
          />

          {/* Student Photo upload with Cloudinary and live preview */}
          <div className="sm:col-span-2 rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
            <label className="block text-sm font-bold text-slate-900">
              Student Profile Photograph (Cloudinary)
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Select student photo (JPEG, PNG, WebP max 5MB). Uploads directly to Cloudinary folder <code className="text-[#0284c7]">talent-institute/students</code>.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#0284c7] file:shadow-xs hover:file:bg-sky-50 cursor-pointer"
                onChange={handlePhotoChange}
              />
              {photoPreview ? (
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-[#0284c7] shadow-sm">
                    <Image
                      src={photoPreview}
                      alt="Student Preview"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Photo Selected
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold"
            >
              {saving ? (
                <Spinner label="Uploading to Cloudinary & saving…" size="sm" />
              ) : editingId ? (
                "Update Student Record"
              ) : (
                "Register Student"
              )}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {/* Student Directory Table with Search */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, roll number, or phone..."
              className="pl-10 border-sky-200"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {items.length} students
          </span>
        </div>

        {loading ? (
          <Card className="py-16 text-center">
            <Spinner label="Loading students directory from database…" size="md" />
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-xs">
            <table className="min-w-full text-left text-sm divide-y divide-slate-100">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">Roll Number</th>
                  <th className="px-4 py-3.5">Student Details</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Course Enrolled</th>
                  <th className="px-4 py-3.5">Credentials</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((s) => (
                  <tr
                    key={s._id || s.id}
                    className="hover:bg-sky-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                      <span className="rounded-md bg-sky-50 border border-sky-200 px-2 py-1 text-sky-950 font-bold">
                        {s.rollNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.photo?.url || s.imageUrl ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-sky-200 shadow-2xs">
                            <Image
                              src={s.photo?.url || s.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">
                            {s.fullName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Father: {s.fatherName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {s.contactNumber || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0284c7]">
                      {s.courseTitle || s.courseName || s.courseId}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col gap-1">
                        {s.certificateUrl ? (
                          <a
                            href={s.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Certificate Issued
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">No Cert</span>
                        )}
                        {s.resultUrl ? (
                          <a
                            href={s.resultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:underline"
                          >
                            <FileCheck2 className="h-3.5 w-3.5" />
                            Result Uploaded
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => startEdit(s)}
                          className="h-8 px-2.5 text-xs font-semibold border-sky-200"
                        >
                          <Pencil className="h-3 w-3" aria-hidden />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          onClick={() => removeStudent(s._id || s.id, s.fullName)}
                          className="h-8 px-2.5 text-xs font-semibold"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                <Users className="mx-auto h-10 w-10 text-sky-200" aria-hidden />
                <p className="mt-2 font-bold text-slate-900 text-sm">No students registered</p>
                <p className="text-slate-400 mt-1">
                  {q ? "No students matched your search filter." : "Use the form above to register your first student."}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
