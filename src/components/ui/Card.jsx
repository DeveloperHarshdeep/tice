export function Card({
  children,
  className = "",
  hoverLift = false,
  tone = "default",
  ...props
}) {
  const tones = {
    default: "bg-card border-border shadow-xs",
    muted: "bg-background-muted/80 border-border",
    sky: "bg-sky-50/70 border-sky-200 shadow-xs",
    aqua: "bg-cyan-50/60 border-cyan-200 shadow-xs",
  };

  const liftClass = hoverLift ? "card-hover-lift" : "";

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 transition-all duration-200 ${tones[tone] || tones.default} ${liftClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
