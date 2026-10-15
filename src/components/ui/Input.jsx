export function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5 text-left">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-lg border border-border bg-white px-3.5 py-2 text-sm text-foreground placeholder:text-slate-400 transition-colors focus:border-brand-sky focus:outline-none focus:ring-2 focus:ring-brand-sky/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "hover:border-slate-300"
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-foreground-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
