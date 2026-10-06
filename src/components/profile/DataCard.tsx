"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { exportProgress, importProgress, resetAllProgress } from "@/lib/state/actions";
import type { LearnerState } from "@/lib/state/types";

export function DataCard({ state }: { state: LearnerState }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  function download() {
    const blob = new Blob([exportProgress(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habla-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ tone: "ok", text: "Progress exported." });
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const error = await importProgress(await file.text());
    setMessage(error ? { tone: "error", text: error } : { tone: "ok", text: "Progress imported." });
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <Card padding="md" as="section" aria-labelledby="data-heading">
      <h2 id="data-heading" className="text-xl font-extrabold">Your data</h2>
      <p className="mt-1 text-sm text-muted">
        Your progress is saved on this device. Accounts and cloud sync are <span className="font-bold">coming later</span> — until then, export a backup to move between devices.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={download} leadingIcon={<Download size={18} aria-hidden="true" />}>Export progress</Button>
        <Button variant="secondary" onClick={() => fileInput.current?.click()} leadingIcon={<Upload size={18} aria-hidden="true" />}>Import progress</Button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose a progress file to import" onChange={(e) => void onFile(e.target.files?.[0])} />
        <Button variant="ghost" onClick={() => setConfirmReset(true)} className="text-on-chili" leadingIcon={<RotateCcw size={18} aria-hidden="true" />}>Reset all progress</Button>
      </div>
      {message && (
        <p role="status" className={message.tone === "ok" ? "mt-3 font-bold text-on-leaf" : "mt-3 font-bold text-on-chili"}>{message.text}</p>
      )}

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all progress?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { resetAllProgress(); setConfirmReset(false); }}>Yes, start over</Button>
          </>
        }
      >
        <p className="text-[17px] text-muted">This deletes your XP, streaks, vocabulary and lesson history on this device, and takes you back to the welcome screen. Export a backup first if you might want it back.</p>
      </Modal>
    </Card>
  );
}
