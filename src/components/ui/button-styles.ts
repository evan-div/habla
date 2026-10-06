import { cn } from "@/lib/util/cn";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-on-brand shadow-[0_4px_0_var(--brand-edge)] hover:bg-brand-hover [--edge:var(--brand-edge)]",
  secondary:
    "bg-surface text-ink border-2 border-line shadow-[0_3px_0_var(--line-strong)] hover:bg-surface-2 [--edge:var(--line-strong)]",
  soft: "bg-soft-teal text-on-teal hover:brightness-95",
  ghost: "bg-transparent text-muted hover:bg-surface-2 hover:text-ink",
  // Fills chosen so white text clears WCAG AA (4.5:1).
  danger: "bg-[#c4352a] text-white shadow-[0_4px_0_#7e2019] hover:bg-[#a82b22] [--edge:#7e2019]",
  success: "bg-[#1a7d38] text-white shadow-[0_4px_0_#0f5224] hover:bg-[#166b30] [--edge:#0f5224]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-[15px] rounded-2xl gap-2",
  lg: "h-14 px-7 text-base rounded-2xl gap-2.5 tracking-wide",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  const tactile = variant === "primary" || variant === "secondary" || variant === "danger" || variant === "success";
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap font-bold select-none",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none aria-disabled:opacity-45",
    tactile && "tactile",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}
