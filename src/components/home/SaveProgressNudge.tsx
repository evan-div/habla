"use client";

import { CloudUpload, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAccount } from "@/lib/auth/account";

const DISMISS_KEY = "habla:nudge-dismissed";

function wasDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/** For guests who've started learning: progress only lives on this device until they make an account. */
export function SaveProgressNudge() {
  const account = useAccount();
  const [hidden, setHidden] = useState(wasDismissed);
  if (account.status !== "signed-out" || hidden) return null;

  return (
    <Card tone="teal" padding="sm" className="mb-5 flex items-center gap-3">
      <CloudUpload size={26} className="shrink-0 text-on-teal" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm sm:text-base">
        <span className="font-extrabold">Don&apos;t lose your streak.</span> <span className="text-muted">Create a free account to keep your progress and use it on your phone and computer.</span>
      </p>
      <ButtonLink href="/signup" size="sm">Save progress</ButtonLink>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setHidden(true);
          try {
            window.sessionStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* fine — it just comes back next visit */
          }
        }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </Card>
  );
}
