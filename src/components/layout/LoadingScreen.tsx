import { Mascot } from "@/components/brand/Mascot";

export function LoadingScreen({ label = "Loading your Spanish…" }: { label?: string }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <Mascot mood="sleepy" size={96} animated />
        <p className="font-bold text-muted">{label}</p>
      </div>
    </div>
  );
}
