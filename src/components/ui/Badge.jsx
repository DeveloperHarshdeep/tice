const styles = {
  default: "bg-sky-50 text-sky-900 border-sky-200",
  sky: "bg-sky-100/80 text-sky-900 border-sky-200",
  aqua: "bg-cyan-50 text-cyan-900 border-cyan-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  danger: "bg-red-50 text-red-800 border-red-200",
  muted: "bg-slate-100 text-slate-700 border-slate-200",
};

export function Badge({ children, tone = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[tone] || styles.default} ${className}`}
    >
      {children}
    </span>
  );
}
