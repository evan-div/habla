import { Mascot } from "@/components/brand/Mascot";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <Mascot mood="thinking" size={130} animated className="mx-auto" />
        <h1 className="mt-4 text-4xl font-extrabold">¡Ay! We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">It may have moved, or the link might be mistyped.</p>
        <ButtonLink href="/" size="lg" className="mt-6">Back to home</ButtonLink>
      </div>
    </main>
  );
}
