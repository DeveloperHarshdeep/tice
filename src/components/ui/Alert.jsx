import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

const tones = {
  info: {
    container: "border-sky-200 bg-sky-50/80 text-sky-950",
    icon: Info,
    iconColor: "text-brand",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
    icon: CheckCircle2,
    iconColor: "text-success",
  },
  error: {
    container: "border-red-200 bg-red-50/80 text-red-950",
    icon: AlertCircle,
    iconColor: "text-danger",
  },
  warning: {
    container: "border-amber-200 bg-amber-50/80 text-amber-950",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
};

export function Alert({ children, tone = "info", title, className = "" }) {
  const cfg = tones[tone] || tones.info;
  const Icon = cfg.icon;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${cfg.container} ${className}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.iconColor}`} aria-hidden />
      <div className="flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? "mt-1 text-sm opacity-90" : ""}>{children}</div>
      </div>
    </div>
  );
}
