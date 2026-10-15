"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch, uploadFile } from "@/lib/admin-fetch";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ClipboardList,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calculator,
  FileDown,
  FileText,
  ExternalLink,
} from "lucide-react";

export function ResultsAdminPanel() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    examName: "Final Practical Examination",
    resultDate: new Date().toISOString().slice(0, 10),
    marksObtained: "85",
    maxMarks: "100",
    publicationStatus: "published",
    showPhotoPublicly: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [results, studs] = await Promise.all([
        adminFetch(`/api/admin/results?q=${encodeURIComponent(q)}`),
        adminFetch("/api/admin/students?limit=100"),
      ]);
      setItems(results.items || []);
      const loadedStuds = studs.items || [];
      setStudents(loadedStuds);
      if (loadedStuds.length > 0) {
        setForm((f) => (f.studentId ? f : { ...f, studentId: loadedStuds[0]._id || loadedStuds[0].id || "" }));
      }
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

  const selectedStudent = students.find((s) => (s._id || s.id) === form.studentId);
  const hasExistingResult = Boolean(
    selectedStudent?.resultUrl ||
      items.some(
        (r) =>
          (r.student?._id || r.student?.id || r.student) === form.studentId &&
          (r._id || r.id) !== editingId
      )
  );

  function handleStudentChange(studentId) {
    setConfirmReplace(false);
    setForm((f) => ({ ...f, studentId }));
  }

  // Live calculation of preview percentage
  const calculatedPercentage =
    form.marksObtained && form.maxMarks && Number(form.maxMarks) > 0
      ? Math.round((Number(form.marksObtained) / Number(form.maxMarks)) * 100)
      : null;

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(null);
    try {
      let fileUrl = undefined;
      let filePublicId = undefined;

      if (file) {
        const uploaded = await uploadFile(file, "talent-institute/results");
        fileUrl = uploaded.url;
        filePublicId = uploaded.publicId;
      }

      const payload = {
        studentId: form.studentId,
        examName: form.examName || "Final Practical Examination",
        resultDate: form.resultDate || new Date().toISOString().slice(0, 10),
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
        publicationStatus: form.publicationStatus,
        showPhotoPublicly: form.showPhotoPublicly,
        replace: confirmReplace,
        ...(fileUrl ? { resultUrl: fileUrl, resultPublicId: filePublicId } : {}),
      };

      if (editingId) {
        await adminFetch(`/api/admin/results/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess({
          message: "Result and scorecard updated successfully.",
          url: fileUrl,
        });
      } else {
        const created = await adminFetch("/api/admin/results", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess({
          message: "Result published and linked to student record successfully!",
          url: fileUrl || created.student?.resultUrl,
        });
      }

      setEditingId(null);
      setFile(null);
      setConfirmReplace(false);
      setForm({
        studentId: students[0]?._id || students[0]?.id || "",
        examName: "Final Practical Examination",
        resultDate: new Date().toISOString().slice(0, 10),
        marksObtained: "85",
        maxMarks: "100",
        publicationStatus: "published",
        showPhotoPublicly: false,
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function editRow(row) {
    setEditingId(row._id || row.id);
    setForm({
      studentId: row.student?._id || row.student,
      examName: row.student?.examName || "Final Practical Examination",
      resultDate: row.student?.resultDate
        ? new Date(row.student.resultDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      marksObtained: String(row.marksObtained),
      maxMarks: String(row.maxMarks),
      publicationStatus: row.publicationStatus,
      showPhotoPublicly: row.showPhotoPublicly || false,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFile(null);
    setConfirmReplace(false);
    setForm({
      studentId: students[0]?._id || students[0]?.id || "",
      examName: "Final Practical Examination",
      resultDate: new Date().toISOString().slice(0, 10),
      marksObtained: "85",
      maxMarks: "100",
      publicationStatus: "published",
      showPhotoPublicly: false,
    });
  }

  async function removeRow(id) {
    if (!confirm("Delete this draft result?")) return;
    try {
      await adminFetch(`/api/admin/results/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Results Entry & Upload Management
          </h1>
          <p className="text-xs text-slate-500">
            Record marks, compute grades automatically, and control draft/published visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="sky">{items.length} Records</Badge>
        </div>
      </div>

      {error ? (
        <Alert tone="error" title="Notice">
          {error}
        </Alert>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 text-emerald-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden />
            <span className="text-xs sm:text-sm font-semibold">{success.message}</span>
          </div>
          {success.url ? (
            <a
              href={success.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              View Uploaded Document
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Result Entry / Edit Form */}
      <Card className="border-sky-200/80 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil className="h-4 w-4 text-brand" aria-hidden />
                Update Examination Result
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 text-brand" aria-hidden />
                Enter Student Result & Upload Document
              </>
            )}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Cancel Edit & Add New
            </button>
          ) : null}
        </div>

        {hasExistingResult && !editingId ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-amber-950">
            <p className="text-xs font-bold flex items-center gap-1.5">
              ⚠️ Warning: Existing Result Detected
            </p>
            <p className="mt-1 text-xs text-amber-900">
              A result is already recorded for {selectedStudent?.fullName} ({selectedStudent?.rollNumber}).
              Saving will overwrite examination scores and replace any uploaded document.
            </p>
            <label className="mt-2.5 flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmReplace}
                onChange={(e) => setConfirmReplace(e.target.checked)}
                className="h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              Confirm replacement and overwrite existing result
            </label>
          </div>
        ) : null}

        <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select
            label="Select Candidate *"
            value={form.studentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            required
            helperText="Choose the enrolled student to assign marks"
          >
            <option value="">-- Choose Candidate --</option>
            {students.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>
                {s.rollNumber} — {s.fullName} ({s.courseTitle || s.courseName || s.courseId})
              </option>
            ))}
          </Select>

          <Select
            label="Publication Status *"
            value={form.publicationStatus}
            onChange={(e) => setForm({ ...form, publicationStatus: e.target.value })}
            helperText="Draft remains hidden from the public results portal"
          >
            <option value="published">Published (Live on public results portal)</option>
            <option value="draft">Draft (Internal review only)</option>
          </Select>

          <Input
            label="Examination Title *"
            value={form.examName}
            onChange={(e) => setForm({ ...form, examName: e.target.value })}
            placeholder="e.g. Final Practical Examination"
            required
          />

          <Input
            label="Examination / Result Date *"
            type="date"
            value={form.resultDate}
            onChange={(e) => setForm({ ...form, resultDate: e.target.value })}
            required
          />

          <Input
            label="Marks Obtained *"
            type="number"
            min="0"
            max={form.maxMarks || "100"}
            value={form.marksObtained}
            onChange={(e) => setForm({ ...form, marksObtained: e.target.value })}
            placeholder="e.g. 85"
            required
          />

          <Input
            label="Maximum Marks *"
            type="number"
            min="1"
            value={form.maxMarks}
            onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
            placeholder="100"
            required
          />

          {/* Live calculation banner */}
          {calculatedPercentage !== null ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 sm:col-span-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-sky-950">
                <Calculator className="h-4 w-4 text-brand" aria-hidden />
                Computed Percentage Preview: {calculatedPercentage}%
              </span>
              <span className="font-bold text-brand">
                {calculatedPercentage >= 40 ? "Status: Pass" : "Status: Fail"}
              </span>
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-foreground">
              Result Document / Marksheet File (PDF or Image)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-1.5 block w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand hover:file:bg-sky-100"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Upload scanned mark sheet or certificate PDF to Cloudinary under talent-institute/results.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving || (hasExistingResult && !editingId && !confirmReplace)}
            >
              {saving ? (
                <Spinner label="Uploading & saving result record…" size="sm" />
              ) : editingId ? (
                "Update Result"
              ) : (
                "Publish / Save Result"
              )}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by roll number or candidate name..."
              className="pl-9"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {items.length} records
          </span>
        </div>

        {loading ? (
          <Card className="py-12 text-center">
            <Spinner label="Loading results database…" size="md" />
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="min-w-full text-left text-sm divide-y divide-slate-100">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">Candidate / Roll</th>
                  <th className="px-4 py-3.5">Score</th>
                  <th className="px-4 py-3.5">Grade</th>
                  <th className="px-4 py-3.5">Document</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((r) => (
                  <tr
                    key={r._id || r.id}
                    className="hover:bg-sky-50/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">
                        {r.student?.fullName || "—"}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        {r.student?.rollNumber || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {r.marksObtained} / {r.maxMarks}
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        ({r.percentage}%)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 text-xs font-bold text-sky-900">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.student?.resultUrl ? (
                        <a
                          href={r.student.resultUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden />
                          View File
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={r.publicationStatus === "published" ? "success" : "muted"}
                      >
                        {r.publicationStatus === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          type="button"
                          onClick={() => editRow(r)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Pencil className="h-3 w-3" aria-hidden />
                          Edit
                        </Button>
                        {r.publicationStatus === "draft" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            type="button"
                            onClick={() => removeRow(r._id || r.id)}
                            className="h-8 px-2.5 text-xs"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden />
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <ClipboardList className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                <p className="mt-2 font-medium">No results entered yet</p>
                <p className="text-slate-400">
                  {q ? "Try clearing your search query." : "Record marks using the form above."}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
