import { LEVEL_TITLES, LEVEL_XP_BASE } from "@/config/levels";

export interface LevelInfo {
  level: number;
  title: string;
  nextTitle: string;
  xpIntoLevel: number;
  xpForLevel: number;
  /** 0–1 progress toward the next level. */
  progress: number;
}

export function xpToReachLevel(level: number): number {
  return LEVEL_XP_BASE * (level - 1) * level;
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
}

export function levelForXp(totalXp: number): number {
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * Math.max(0, totalXp)) / LEVEL_XP_BASE)) / 2));
}

export function levelInfo(totalXp: number): LevelInfo {
  const level = levelForXp(totalXp);
  const floor = xpToReachLevel(level);
  const span = xpToReachLevel(level + 1) - floor;
  const into = totalXp - floor;
  return {
    level,
    title: levelTitle(level),
    nextTitle: levelTitle(level + 1),
    xpIntoLevel: into,
    xpForLevel: span,
    progress: Math.min(1, into / span),
  };
}
