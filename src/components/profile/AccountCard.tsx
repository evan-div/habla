"use client";

import { Cloud, CloudOff, LoaderCircle, LogOut, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { signOut, useAccount } from "@/lib/auth/account";
import { syncEngine, useSyncStatus } from "@/lib/sync/runtime";

function clockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function AccountCard() {
  const router = useRouter();
  const account = useAccount();
  const sync = useSyncStatus();
  const [confirmOut, setConfirmOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unsynced, setUnsynced] = useState(false);

  if (account.status === "loading") return null;

  async function leave(force: boolean) {
    setBusy(true);
    const result = await signOut({ force });
    setBusy(false);
    if (!result.ok) {
      setUnsynced(true);
      return;
    }
    setConfirmOut(false);
    setUnsynced(false);
    router.replace("/onboarding");
  }

  if (account.status === "unavailable") {
    return (
      <Card padding="md" as="section" aria-labelledby="account-heading">
        <h2 id="account-heading" className="text-xl font-extrabold">Account</h2>
        <p className="mt-1 text-sm text-muted">Accounts aren&apos;t turned on for this copy of the app, so progress is saved on this device only.</p>
      </Card>
    );
  }

  if (account.status === "signed-out") {
    return (
      <Card tone="teal" padding="md" as="section" aria-labelledby="account-heading">
        <h2 id="account-heading" className="text-xl font-extrabold">Save your progress</h2>
        <p className="mt-1 text-muted">
          Create a free account to keep your streak, words and XP safe — and pick up on your phone or computer exactly where you left off.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/signup">Create account</ButtonLink>
          <ButtonLink href="/login" variant="secondary">Log in</ButtonLink>
        </div>
      </Card>
    );
  }

  const statusLine =
    sync.status === "syncing" ? (
      <span className="inline-flex items-center gap-1.5"><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> Syncing…</span>
    ) : sync.status === "synced" ? (
      <span className="inline-flex items-center gap-1.5 text-on-leaf"><Cloud size={16} aria-hidden="true" /> Synced{sync.lastSyncedAt ? ` at ${clockTime(sync.lastSyncedAt)}` : ""}</span>
    ) : sync.status === "offline" ? (
      <span className="inline-flex items-center gap-1.5"><CloudOff size={16} aria-hidden="true" /> Offline — will sync when you reconnect</span>
    ) : sync.status === "error" ? (
      <span className="inline-flex items-center gap-1.5 text-on-chili"><TriangleAlert size={16} aria-hidden="true" /> Couldn&apos;t sync</span>
    ) : null;

  return (
    <Card padding="md" as="section" aria-labelledby="account-heading">
      <h2 id="account-heading" className="text-xl font-extrabold">Account</h2>
      <p className="mt-1 break-all text-muted">Signed in as <span className="font-bold text-ink">{account.email}</span></p>
      <p className="mt-1 text-sm font-bold text-muted" role="status" aria-live="polite">{statusLine}</p>
      {sync.status === "error" && sync.message && <p className="mt-1 text-sm text-muted">{sync.message}</p>}
      <p className="mt-2 text-sm text-muted">Your progress syncs automatically. Log in on another device to continue there.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => void syncEngine.refresh()} disabled={sync.status === "syncing"}>Sync now</Button>
        <Button variant="ghost" onClick={() => setConfirmOut(true)} leadingIcon={<LogOut size={18} aria-hidden="true" />}>Log out</Button>
      </div>

      <Modal
        open={confirmOut}
        onClose={() => {
          setConfirmOut(false);
          setUnsynced(false);
        }}
        title="Log out of this device?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setConfirmOut(false); setUnsynced(false); }}>Cancel</Button>
            {unsynced ? (
              <Button variant="danger" disabled={busy} onClick={() => void leave(true)}>Log out anyway</Button>
            ) : (
              <Button disabled={busy} onClick={() => void leave(false)}>{busy ? "Saving…" : "Log out"}</Button>
            )}
          </>
        }
      >
        {unsynced ? (
          <p role="alert" className="text-[17px] font-bold text-on-chili">
            Your latest progress couldn&apos;t be saved to your account (are you offline?). If you log out now, anything since your last sync is lost. Cancel and try again once you&apos;re back online.
          </p>
        ) : (
          <p className="text-[17px] text-muted">Your progress is saved to your account first, then removed from this device. Log back in any time to get it back.</p>
        )}
      </Modal>
    </Card>
  );
}
