import { mulberry32 } from "@/lib/util/random";

const COLORS = ["#0e8e94", "#db2169", "#f7b500", "#2ba84f", "#7a55e0", "#ff86ae"];

/** A tasteful one-shot burst. Deterministic (seeded) so it renders identically on server and client. */
export function Confetti({ count = 30, seed = 7 }: { count?: number; seed?: number }) {
  const rand = mulberry32(seed);
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: rand() * 100,
    delay: rand() * 0.7,
    duration: 2.2 + rand() * 1.4,
    dx: (rand() - 0.5) * 160,
    rot: 200 + rand() * 520,
    color: COLORS[i % COLORS.length],
    w: 6 + rand() * 6,
    h: 10 + rand() * 8,
    round: rand() > 0.7,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 opacity-0"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            ["--dx" as string]: `${p.dx}px`,
            ["--rot" as string]: `${p.rot}deg`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s cubic-bezier(0.25, 0.6, 0.4, 1) forwards`,
          }}
        />
      ))}
    </div>
  );
}
