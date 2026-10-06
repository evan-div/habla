import type { UnitAccent } from "@/content/types";

/** Tailwind classes per unit accent: solid tile + soft tint. */
export const ACCENT_TILE: Record<UnitAccent, string> = {
  teal: "bg-teal-500 text-white",
  rosa: "bg-rosa-500 text-white",
  sol: "bg-sol-300 text-[#4a3300]",
  leaf: "bg-leaf-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const ACCENT_SOFT: Record<UnitAccent, string> = {
  teal: "bg-soft-teal text-on-teal",
  rosa: "bg-soft-rosa text-on-rosa",
  sol: "bg-soft-sol text-on-sol",
  leaf: "bg-soft-leaf text-on-leaf",
  violet: "bg-soft-violet text-on-violet",
};
