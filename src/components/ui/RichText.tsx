import { Fragment } from "react";

/** Minimal inline formatting for authored copy: **bold** and *italic*. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**")) return <strong key={i} className="font-extrabold text-ink">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
}
