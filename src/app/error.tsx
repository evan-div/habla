"use client";

import { useEffect } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function GlobalRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center" role="alert">
      <div>
        <Mascot mood="sleepy" size={130} className="mx-auto" />
        <h1 className="mt-4 text-4xl font-extrabold">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">Your progress is safe — it&apos;s saved on this device. Try again, or head back home.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>Try again</Button>
          <ButtonLink href="/" size="lg" variant="secondary">Back to home</ButtonLink>
        </div>
      </div>
    </main>
  );
}
