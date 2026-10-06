import type { ReactNode } from "react";
import { Card, type CardTone } from "./Card";
import { cn } from "@/lib/util/cn";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: CardTone;
  className?: string;
}

export function StatCard({ label, value, hint, icon, tone = "default", className }: StatCardProps) {
  return (
    <Card tone={tone} padding="sm" className={cn("flex items-start gap-3", className)}>
      {icon && <span className="mt-0.5 shrink-0" aria-hidden="true">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        <p className="font-display text-2xl font-extrabold leading-tight text-ink">{value}</p>
        {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      </div>
    </Card>
  );
}
