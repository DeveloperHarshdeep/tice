export function Spinner({ label = "Loading…", size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-sm font-medium text-foreground-muted ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`animate-spin rounded-full border-brand border-t-transparent ${sizes[size] || sizes.md}`}
        aria-hidden
      />
      {label ? <span>{label}</span> : null}
      <span className="sr-only">{label || "Loading"}</span>
    </div>
  );
}
