"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { Mascot } from "@/components/brand/Mascot";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requestPasswordReset, signIn, signUp, useAccount } from "@/lib/auth/account";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/rules";
import { syncEngine, useSyncStatus } from "@/lib/sync/runtime";
import { PasswordField, TextField } from "./fields";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<Mode, { title: string; subtitle: string; submit: string }> = {
  login: { title: "Welcome back", subtitle: "Log in to pick up where you left off — on any device.", submit: "Log in" },
  signup: { title: "Save your progress", subtitle: "Create a free account so your streak and words follow you from your phone to your computer.", submit: "Create account" },
  forgot: { title: "Reset your password", subtitle: "Enter your email and we'll send you a link to choose a new one.", submit: "Send reset link" },
};

export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter();
  const account = useAccount();
  const sync = useSyncStatus();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Once signed in and the first sync has settled, head into the app.
  const settled = account.status === "signed-in" && (sync.status === "synced");
  useEffect(() => {
    if (settled) router.replace("/");
  }, [settled, router]);

  if (account.status === "loading") return <LoadingScreen label="One moment…" />;

  if (account.status === "signed-in") {
    if (sync.status === "error" || sync.status === "offline") {
      return (
        <Shell>
          <Card padding="lg" className="text-center">
            <h1 className="text-2xl font-extrabold">You&apos;re signed in</h1>
            <p role="status" className="mt-2 text-muted">{sync.message}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={() => void syncEngine.refresh()}>Try again</Button>
              <Button variant="ghost" onClick={() => router.replace("/")}>Continue with this device&apos;s progress</Button>
            </div>
          </Card>
        </Shell>
      );
    }
    return <LoadingScreen label="Syncing your progress…" />;
  }

  if (account.status === "unavailable") {
    return (
      <Shell>
        <Card padding="lg">
          <h1 className="text-2xl font-extrabold">Accounts aren&apos;t set up yet</h1>
          <p className="mt-2 text-muted">
            Your progress is saved on this device. To turn on accounts and syncing, connect a Supabase project — see <span className="font-bold">Accounts &amp; sync</span> in the README.
          </p>
          <Button className="mt-5" fullWidth onClick={() => router.replace("/")}>Back to the app</Button>
        </Card>
      </Shell>
    );
  }

  const copy = COPY[mode];

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
    setPassword("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === "signup" && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
      return;
    }

    setBusy(true);
    try {
      if (mode === "forgot") {
        const result = await requestPasswordReset(email);
        if (!result.ok) setError(result.error);
        else setNotice("If there's an account for that email, a reset link is on its way. Check your inbox (and spam).");
        return;
      }
      const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);
      if (!result.ok) setError(result.error);
      else if (result.needsConfirmation) setNotice("Almost there! We sent a confirmation link to your email. Open it, then come back here to log in.");
      // Otherwise we're signed in: the effect above navigates once the first sync finishes.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="animate-rise">
        <Mascot mood={mode === "signup" ? "cheer" : "happy"} size={96} animated className="mx-auto" />
        <h1 className="mt-3 text-center text-3xl font-extrabold">{copy.title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-center text-muted">{copy.subtitle}</p>

        <Card padding="lg" className="mt-6">
          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            <TextField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {mode !== "forgot" && (
              <PasswordField
                label="Password"
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={mode === "signup" ? MIN_PASSWORD_LENGTH : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint={mode === "signup" ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
              />
            )}

            {error && <p role="alert" className="font-bold text-on-chili">{error}</p>}
            {notice && <p role="status" className="font-bold text-on-leaf">{notice}</p>}

            <Button type="submit" size="lg" fullWidth disabled={busy || !email.trim() || (mode !== "forgot" && !password)}>
              {busy ? "One moment…" : copy.submit}
            </Button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-1 text-sm">
            {mode === "login" && (
              <>
                <button type="button" onClick={() => switchMode("forgot")} className="rounded-lg px-2 py-1 font-bold text-muted underline-offset-2 hover:underline">
                  Forgot your password?
                </button>
                <p className="text-muted">
                  New here?{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="font-extrabold text-on-teal underline-offset-2 hover:underline">Create an account</button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted">
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="font-extrabold text-on-teal underline-offset-2 hover:underline">Log in</button>
              </p>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => switchMode("login")} className="rounded-lg px-2 py-1 font-extrabold text-on-teal underline-offset-2 hover:underline">Back to log in</button>
            )}
          </div>
        </Card>

        <p className="mt-5 text-center text-sm text-muted">
          Progress you&apos;ve made on this device is kept and added to your account.
        </p>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-5 sm:pt-8">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Back to the app" className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface-2">
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <Logo />
        <span className="h-11 w-11" />
      </header>
      <main className="flex flex-1 flex-col justify-center py-6">{children}</main>
    </div>
  );
}
