"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/util/cn";
import { NAV_ITEMS, isActivePath } from "./nav";

export function MobileNav({ dueCount }: { dueCount: number }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6">
        {NAV_ITEMS.map(({ href, label, icon: IconCmp }) => {
          const active = isActivePath(pathname, href);
          const showBadge = href === "/review" && dueCount > 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-16 flex-col items-center justify-center gap-0.5 text-[10.5px] font-bold", active ? "text-on-teal" : "text-muted")}
              >
                <span className={cn("grid h-8 w-12 place-items-center rounded-full transition-colors", active && "bg-soft-teal")}>
                  <IconCmp size={22} strokeWidth={active ? 2.6 : 2.2} aria-hidden="true" />
                </span>
                {label}
                {showBadge && (
                  <span className="absolute right-2 top-1.5 grid min-w-4 place-items-center rounded-full bg-rosa-500 px-1 text-[10px] font-extrabold leading-4 text-white">
                    {dueCount > 99 ? "99+" : dueCount}
                    <span className="sr-only"> words due</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
