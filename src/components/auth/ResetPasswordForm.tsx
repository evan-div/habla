"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { Mascot } from "@/components/brand/Mascot";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updatePassword, useAccount } from "@/lib/auth/account";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/rules";
import { PasswordField } from "./fields";

/** Landing page for the emailed "reset your password" link, which signs the person in on arrival. */
export function ResetPasswordForm() {
  const router = useRouter();
  const account = useAccount();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (account.status === "loading") return <LoadingScreen label="One moment…" />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await updatePassword(password);
    setBusy(false);
    if (!result.ok) setError(result.error);
    else setDone(true);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-5 sm:pt-8">
      <header className="flex justify-center"><Link href="/" aria-label="¡Habla! home"><Logo /></Link></header>
      <main className="flex flex-1 flex-col justify-center py-6">
        <Mascot mood={done ? "cheer" : "thinking"} size={96} animated className="mx-auto" />
        <Card padding="lg" className="mt-4">
          {done ? (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">Password updated</h1>
              <p className="mt-2 text-muted">You&apos;re all set — you can keep learning.</p>
              <Button className="mt-5" fullWidth size="lg" onClick={() => router.replace("/")}>Continue</Button>
            </div>
          ) : account.status === "signed-in" ? (
            <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
              <h1 className="text-2xl font-extrabold">Choose a new password</h1>
              <PasswordField label="New password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} hint={`At least ${MIN_PASSWORD_LENGTH} characters.`} />
              {error && <p role="alert" className="font-bold text-on-chili">{error}</p>}
              <Button type="submit" size="lg" fullWidth disabled={busy || !password}>{busy ? "Saving…" : "Save new password"}</Button>
            </form>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">This link has expired</h1>
              <p className="mt-2 text-muted">Reset links only work once, for a short time. Request a fresh one from the log-in screen.</p>
              <ButtonLink href="/login" className="mt-5" fullWidth size="lg">Go to log in</ButtonLink>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
