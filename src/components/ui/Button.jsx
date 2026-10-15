import Link from "next/link";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-dark shadow-xs hover:shadow-sm active:scale-[0.99] border border-transparent focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2",
  secondary:
    "bg-white text-foreground border border-border hover:border-brand-sky hover:bg-slate-50 active:scale-[0.99] shadow-xs focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2",
  accent:
    "bg-brand-sky text-slate-900 font-semibold hover:bg-sky-400 shadow-xs active:scale-[0.99] border border-sky-300 focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-brand-sky",
  danger:
    "bg-danger text-white hover:bg-red-700 shadow-xs active:scale-[0.99] border border-transparent focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2",
  outline:
    "bg-transparent text-brand border border-brand/40 hover:border-brand hover:bg-sky-50/50 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg min-h-[34px]",
  md: "px-4 py-2 text-sm font-semibold rounded-lg min-h-[40px]",
  lg: "px-5 py-2.5 text-base font-semibold rounded-xl min-h-[46px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  type = "button",
  disabled,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
