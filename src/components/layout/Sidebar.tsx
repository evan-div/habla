"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { levelInfo } from "@/lib/gamification/levels";
import { cn } from "@/lib/util/cn";
import type { LearnerState } from "@/lib/state/types";
import { NAV_ITEMS, isActivePath } from "./nav";

interface SidebarProps {
  state: LearnerState | null;
  dueCount: number;
}

/** Icon rail on tablets, full sidebar on desktop. Hidden on phones (see MobileNav). */
export function Sidebar({ state, dueCount }: SidebarProps) {
  const pathname = usePathname();
  const level = state ? levelInfo(state.totalXp) : null;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[5.5rem] flex-col border-r-2 border-line bg-surface md:flex lg:w-64">
      <div className="flex h-[4.5rem] items-center justify-center px-3 lg:justify-start lg:px-6">
        <Link href="/" aria-label="¡Habla! home" className="rounded-xl">
          <span className="lg:hidden"><Logo compact /></span>
          <span className="hidden lg:inline"><Logo /></span>
        </Link>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2 lg:px-4">
        {NAV_ITEMS.map(({ href, label, icon: IconCmp }) => {
          const active = isActivePath(pathname, href);
          const showBadge = href === "/review" && dueCount > 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-bold transition-colors lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-[15px]",
                active ? "bg-soft-teal text-on-teal" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <IconCmp size={24} strokeWidth={active ? 2.6 : 2.2} aria-hidden="true" />
              <span>{label}</span>
              {showBadge && (
                <span className="absolute right-2 top-1.5 grid min-w-5 place-items-center rounded-full bg-rosa-500 px-1.5 text-[11px] font-extrabold leading-5 text-white lg:static lg:ml-auto">
                  {dueCount > 99 ? "99+" : dueCount}
                  <span className="sr-only"> words due for review</span>
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t-2 border-line" role="separator" />
        <Link
          href="/grammar"
          aria-current={isActivePath(pathname, "/grammar") ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-bold transition-colors lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-[15px]",
            isActivePath(pathname, "/grammar") ? "bg-soft-violet text-on-violet" : "text-muted hover:bg-surface-2 hover:text-ink",
          )}
        >
          <GraduationCap size={24} aria-hidden="true" />
          <span>Grammar</span>
        </Link>
      </nav>

      {level && state && (
        <div className="hidden border-t-2 border-line p-4 lg:block">
          <Link href="/progress" className="flex items-center gap-3 rounded-2xl p-2 hover:bg-surface-2">
            <LevelBadge level={level.level} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{level.title}</p>
              <ProgressBar value={level.progress * 100} size="sm" tone="violet" label={`Progress to level ${level.level + 1}`} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted">{level.xpIntoLevel} / {level.xpForLevel} XP</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
