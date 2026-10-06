import { cn } from "@/lib/util/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-2xl", className)} />;
}
