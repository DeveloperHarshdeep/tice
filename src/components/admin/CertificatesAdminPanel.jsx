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
  Award,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  FileCheck,
} from "lucide-react";

export function CertificatesAdminPanel() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [confirmReissue, setConfirmReissue] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    certificateNumber: "",
    courseName: "",
    issueDate: new Date().toISOString().slice(0, 10),
    status: "issued",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [certs, studs] = await Promise.all([
        adminFetch(`/api/admin/certificates?q=${encodeURIComponent(q)}`),
        adminFetch("/api/admin/students?limit=100"),
      ]);
      setItems(certs.items || []);
      const loadedStuds = studs.items || [];
      setStudents(loadedStuds);
      if (loadedStuds.length > 0) {
        setForm((f) => {
          if (f.studentId) return f;
          const first = loadedStuds[0];
          return {
            ...f,
            studentId: first._id || first.id || "",
            courseName: first.courseTitle || first.courseName || first.courseId || "",
          };
        });
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

  const selectedStudent = students.find(
    (s) => (s._id || s.id) === form.studentId
  );
  const hasExistingCertificate = Boolean(
    selectedStudent?.certificateUrl ||
      items.some(
        (c) =>
          (c.student?._id || c.student?.id || c.student) === form.studentId &&
          (c._id || c.id) !== editingId
      )
  );

  function handleStudentChange(studentId) {
    const s = students.find((st) => (st._id || st.id) === studentId);
    setConfirmReissue(false);
    setForm((f) => ({
      ...f,
      studentId,
      courseName: s?.courseTitle || s?.courseName || s?.courseId || f.courseName,
      certificateNumber: f.certificateNumber || `TICE-CERT-${new Date().getFullYear()}-${s?.rollNumber?.replace(/[^a-zA-Z0-9]/g, "").slice(-4) || "001"}`,
    }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(null);
    try {
      let filePayload = null;
      if (file) {
        const uploaded = await uploadFile(file, "talent-institute/certificates");
        filePayload = { url: uploaded.url, publicId: uploaded.publicId };
      }

      if (editingId) {
        const patchBody = {
          ...form,
          ...(filePayload ? { file: filePayload } : {}),
        };
        await adminFetch(`/api/admin/certificates/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(patchBody),
        });
        setSuccess({
          message: "Certificate record updated successfully.",
          url: filePayload?.url,
        });
      } else {
        const postBody = {
          ...form,
          reissue: confirmReissue,
          ...(filePayload ? { file: filePayload } : {}),
        };
        const created = await adminFetch("/api/admin/certificates", {
          method: "POST",
          body: JSON.stringify(postBody),
        });
        setSuccess({
          message: "Certificate generated and issued successfully in Portrait A4 format!",
          url: created.certificateUrl || created.certificate?.file?.url,
        });
      }

      setEditingId(null);
      setFile(null);
      setConfirmReissue(false);
      setForm({
        studentId: students[0]?._id || students[0]?.id || "",
        certificateNumber: "",
        courseName: students[0]?.courseTitle || students[0]?.courseName || "",
        issueDate: new Date().toISOString().slice(0, 10),
        status: "issued",
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
      certificateNumber: row.certificateNumber,
      courseName: row.courseName,
      issueDate: row.issueDate
        ? new Date(row.issueDate).toISOString().slice(0, 10)
        : "",
      status: row.status,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFile(null);
    setForm({
      studentId: students[0]?._id || students[0]?.id || "",
      certificateNumber: "",
      courseName: "",
      issueDate: "",
      status: "draft",
    });
  }

  async function revoke(id) {
    if (
      !confirm(
        "Revoke this certificate? The verification portal will display an official revocation status."
      )
    )
      return;
    try {
      await adminFetch(`/api/admin/certificates/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "revoked" }),
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeDraft(id) {
    if (!confirm("Delete this draft certificate record permanently?")) return;
    try {
      await adminFetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const tone = (status) =>
    status === "issued" ? "success" : status === "revoked" ? "danger" : "muted";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Certificate Registry & Issuance
          </h1>
          <p className="text-xs text-slate-500">
            Issue verifiable credentials, upload scanned documents, and manage validity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="sky">{items.length} Issued/Draft</Badge>
        </div>
      </div>

      {error ? (
        <Alert tone="error" title="Certificate Notice">
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
              View Issued Certificate
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Issuance Form */}
      <Card className="border-sky-200/80 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil className="h-4 w-4 text-brand" aria-hidden />
                Update Certificate Record
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 text-brand" aria-hidden />
                Issue New Certificate (A4 Portrait)
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

        {hasExistingCertificate && !editingId ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-amber-950">
            <p className="text-xs font-bold flex items-center gap-1.5">
              ⚠️ Warning: Existing Certificate Detected
            </p>
            <p className="mt-1 text-xs text-amber-900">
              A certificate has already been issued to {selectedStudent?.fullName} ({selectedStudent?.rollNumber}).
              Issuing again will overwrite the existing certificate file and registry record.
            </p>
            <label className="mt-2.5 flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmReissue}
                onChange={(e) => setConfirmReissue(e.target.checked)}
                className="h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              Confirm reissue and overwrite previously issued certificate
            </label>
          </div>
        ) : null}

        <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select
            label="Candidate Student *"
            value={form.studentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            required
            helperText="Associate certificate with registered student"
          >
            <option value="">-- Choose Candidate --</option>
            {students.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>
                {s.rollNumber} — {s.fullName} ({s.courseTitle || s.courseName || s.courseId})
              </option>
            ))}
          </Select>

          <Input
            label="Certificate Number"
            value={form.certificateNumber}
            onChange={(e) =>
              setForm({ ...form, certificateNumber: e.target.value })
            }
            placeholder="e.g. TICE-CERT-2026-001"
            helperText="Auto-generated if left blank"
          />

          <Input
            label="Course Name (as printed on certificate) *"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            placeholder="e.g. Diploma in Computer Applications (DCA)"
            required
          />

          <Input
            label="Date of Issuance *"
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            required
          />

          <Select
            label="Certificate Status *"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            helperText="Only 'Issued' certificates are verifiable publicly"
          >
            <option value="issued">Issued (Verified & Live)</option>
            <option value="draft">Draft (Hidden from public verification)</option>
            <option value="revoked">Revoked (Invalidated)</option>
          </Select>

          <div>
            <label className="block text-sm font-semibold text-foreground">
              Custom Certificate File (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-1.5 block w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand hover:file:bg-sky-100"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Leave blank to automatically generate an authentic portrait A4 certificate.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving || (hasExistingCertificate && !editingId && !confirmReissue)}
            >
              {saving ? (
                <Spinner label="Generating & issuing portrait certificate…" size="sm" />
              ) : editingId ? (
                "Update Certificate"
              ) : (
                "Generate & Issue Portrait Certificate"
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

      {/* Registry Table */}
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
              placeholder="Filter by cert # or candidate..."
              className="pl-9"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {items.length} records
          </span>
        </div>

        {loading ? (
          <Card className="py-12 text-center">
            <Spinner label="Loading certificate registry…" size="md" />
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="min-w-full text-left text-sm divide-y divide-slate-100">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">Certificate #</th>
                  <th className="px-4 py-3.5">Candidate / Roll</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">File</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((c) => (
                  <tr
                    key={c._id || c.id}
                    className="hover:bg-sky-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                      {c.certificateNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {c.student?.fullName || "—"}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        {c.student?.rollNumber || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-brand font-medium">
                      {c.courseName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={tone(c.status)} className="capitalize">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {c.file?.url ? (
                        <a
                          href={c.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                        >
                          <FileCheck className="h-3.5 w-3.5" aria-hidden />
                          View File
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          type="button"
                          onClick={() => editRow(c)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Pencil className="h-3 w-3" aria-hidden />
                          Edit
                        </Button>
                        {c.status === "issued" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            type="button"
                            onClick={() => revoke(c._id || c.id)}
                            className="h-8 px-2.5 text-xs"
                          >
                            Revoke
                          </Button>
                        ) : null}
                        {c.status === "draft" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            type="button"
                            onClick={() => removeDraft(c._id || c.id)}
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
                <Award className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                <p className="mt-2 font-medium">No certificates registered yet</p>
                <p className="text-slate-400">
                  {q ? "Try clearing your search query." : "Issue a certificate using the form above."}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
