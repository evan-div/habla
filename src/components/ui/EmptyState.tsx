import type { ReactNode } from "react";
import { Mascot, type MascotMood } from "@/components/brand/Mascot";

export function EmptyState({ title, children, action, mood = "happy" }: { title: string; children?: ReactNode; action?: ReactNode; mood?: MascotMood }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <Mascot mood={mood} size={110} animated />
      <h3 className="mt-3 text-xl font-extrabold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
