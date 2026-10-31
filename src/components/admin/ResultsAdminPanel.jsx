"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { adminFetch, uploadFile } from "@/lib/admin-fetch";
import { getCourseById } from "@/data/courses";
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
  const [file, setFile] = useState(null);
const [form, setForm] = useState({
  studentId: "",
  courseName: "",
  examName: "Final Practical Examination",
  resultDate: new Date().toISOString().slice(0, 10),
  marksObtained: "",
  maxMarks: "100",
  passingPercentage: "",
  grade: "",
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
  function handleStudentChange(studentId) {
    setForm((f) => ({ ...f, studentId }));
  }

  const marksAreValid =
    form.marksObtained.trim() !== "" &&
    form.maxMarks.trim() !== "" &&
    Number.isFinite(Number(form.marksObtained)) &&
    Number.isFinite(Number(form.maxMarks)) &&
    Number(form.maxMarks) > 0 &&
    Number(form.marksObtained) >= 0 &&
    Number(form.marksObtained) <= Number(form.maxMarks);
  const calculatedPercentage =
    marksAreValid
      ? Math.round(
          (Number(form.marksObtained) / Number(form.maxMarks)) * 10000
        ) / 100
      : null;
  const passingPercentageIsValid =
    form.passingPercentage.trim() !== "" &&
    Number.isFinite(Number(form.passingPercentage)) &&
    Number(form.passingPercentage) >= 0 &&
    Number(form.passingPercentage) <= 100;
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
        courseName: form.courseName.trim(),
        examName: form.examName,
        ...(form.resultDate ? { resultDate: form.resultDate } : {}),
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
        passingPercentage: Number(form.passingPercentage),
        grade: form.grade.trim(),
        publicationStatus: form.publicationStatus,
        showPhotoPublicly: form.showPhotoPublicly,
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
          url: fileUrl || created.result?.resultUrl,
        });
      }


setEditingId(null);
setFile(null);

setForm({
  studentId: "",
  courseName: "",
  examName: "Final Practical Examination",
  resultDate: new Date().toISOString().slice(0, 10),
  marksObtained: "",
  maxMarks: "100",
  passingPercentage: "",
  grade: "",
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
      courseName:
        row.courseName ||
        getCourseById(row.courseId)?.title ||
        row.student?.courseName ||
        getCourseById(row.student?.courseId)?.title ||
        row.courseId ||
        row.student?.courseId ||
        "",
      examName: row.examName || "Final Practical Examination",
      resultDate: row.resultDate
        ? new Date(row.resultDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      marksObtained: String(row.marksObtained),
      maxMarks: String(row.maxMarks),
      passingPercentage:
        row.passingPercentage === undefined || row.passingPercentage === null
          ? ""
          : String(row.passingPercentage),
      grade: row.grade || "",
      publicationStatus: row.publicationStatus,
      showPhotoPublicly: row.showPhotoPublicly || false,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


function cancelEdit() {
  setEditingId(null);
  setFile(null);

  setForm({
    studentId: "",
    courseName: "",
    examName: "Final Practical Examination",
    resultDate: new Date().toISOString().slice(0, 10),
    marksObtained: "",
    maxMarks: "100",
    passingPercentage: "",
    grade: "",
    publicationStatus: "published",
    showPhotoPublicly: false,
  });
}

  async function removeRow(id) {
    if (!confirm("Delete this examination result? The student and other results will remain unchanged.")) return;
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

        <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select
            label="Select Student *"
            value={form.studentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            disabled={Boolean(editingId)}
            required
            helperText={
              editingId
                ? "The student linked to an existing result cannot be changed."
                : "Choose the existing student by registration number"
            }
          >
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>
                {s.rollNumber} — {s.fullName}
              </option>
            ))}
          </Select>

          <Input
            label="Course Name *"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            placeholder="e.g. Data Analyst"
            required
            maxLength={160}
          />

          {selectedStudent ? (
            <div className="flex items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/60 p-4 sm:col-span-2">
              {selectedStudent.photo?.url || selectedStudent.imageUrl ? (
                <Image
                  src={selectedStudent.photo?.url || selectedStudent.imageUrl}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : null}
              <dl className="grid min-w-0 flex-1 grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
                <div>
                  <dt className="font-semibold text-slate-500">Student</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{selectedStudent.fullName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Registration Number</dt>
                  <dd className="mt-0.5 font-mono font-bold text-slate-900">{selectedStudent.rollNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Father&apos;s Name</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{selectedStudent.fatherName || "—"}</dd>
                </div>
              </dl>
            </div>
          ) : null}

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
            label="Examination Date"
            type="date"
            value={form.resultDate}
            onChange={(e) => setForm({ ...form, resultDate: e.target.value })}
          />

          <Input
            label="Marks Obtained *"
            type="number"
            min="0"
            step="any"
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
            step="any"
            value={form.maxMarks}
            onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
            placeholder="100"
            required
          />

          <Input
            label="Passing Percentage (%) *"
            type="number"
            min="0"
            max="100"
            step="any"
            value={form.passingPercentage}
            onChange={(e) =>
              setForm({ ...form, passingPercentage: e.target.value })
            }
            required
          />

          <Input
            label="Grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            placeholder="Leave blank to calculate from percentage"
            maxLength={24}
            helperText="Enter a grade manually or leave blank for the existing grade calculation."
          />

          {/* Live calculation banner */}
          {calculatedPercentage !== null ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 sm:col-span-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-sky-950">
                <Calculator className="h-4 w-4 text-brand" aria-hidden />
                Computed Percentage Preview: {calculatedPercentage.toFixed(2)}%
              </span>
              <span className="font-bold text-brand">
                {passingPercentageIsValid
                  ? (Number(form.marksObtained) / Number(form.maxMarks)) * 100 >=
                    Number(form.passingPercentage)
                    ? "Status: Pass"
                    : "Status: Fail"
                  : "Enter a passing percentage to calculate status"}
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
              Upload a scanned marksheet or certificate PDF to Cloudinary.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.showPhotoPublicly}
              onChange={(e) =>
                setForm({ ...form, showPhotoPublicly: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Show the student photograph on the public result page
          </label>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={
                saving ||
                !form.studentId ||
                form.courseName.trim().length < 2 ||
                !form.examName.trim() ||
                !Number.isFinite(Number(form.marksObtained)) ||
                !Number.isFinite(Number(form.maxMarks)) ||
                Number(form.maxMarks) <= 0 ||
                Number(form.marksObtained) < 0 ||
                Number(form.marksObtained) > Number(form.maxMarks) ||
                !Number.isFinite(Number(form.passingPercentage)) ||
                form.passingPercentage.trim() === "" ||
                Number(form.passingPercentage) < 0 ||
                Number(form.passingPercentage) > 100
              }
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
              placeholder="Filter by registration number or student name..."
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
                  <th className="px-4 py-3.5">Student / Registration No.</th>
                  <th className="px-4 py-3.5">Examination / Course</th>
                  <th className="px-4 py-3.5">Score</th>
                  <th className="px-4 py-3.5">Pass Mark</th>
                  <th className="px-4 py-3.5">Outcome</th>
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
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {r.examName || "Final Course Examination"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {r.courseName ||
                          getCourseById(r.courseId)?.title ||
                          r.student?.courseName ||
                          getCourseById(r.student?.courseId)?.title ||
                          r.courseId ||
                          "Course not recorded"}
                      </p>
                      {r.resultDate ? (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {new Date(r.resultDate).toLocaleDateString("en-IN")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {r.marksObtained} / {r.maxMarks}
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        ({Number(r.percentage).toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.passingPercentage !== null &&
                      r.passingPercentage !== undefined &&
                      Number.isFinite(Number(r.passingPercentage))
                        ? `${Number(r.passingPercentage).toFixed(2)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.passStatus ? (
                        <Badge tone={r.passStatus === "pass" ? "success" : "danger"}>
                          {r.passStatus === "pass" ? "PASS" : "FAIL"}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.resultUrl || r.student?.resultUrl ? (
                        <a
                          href={r.resultUrl || r.student.resultUrl}
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
