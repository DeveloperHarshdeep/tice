export async function adminFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    throw new Error(json.error?.message || "Request failed");
  }
  return json.data;
}

export async function uploadFile(file, folder) {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error?.message || "Upload failed");
  }
  return json.data;
}
