import type { ReactNode } from "react";

export function ExerciseHeading({ eyebrow, title, children }: { eyebrow: string; title?: string; children?: ReactNode }) {
  return (
    <header className="mb-5">
      <p className="text-xs font-extrabold uppercase tracking-widest text-on-teal">{eyebrow}</p>
      {title && <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>}
      {children}
    </header>
  );
}
