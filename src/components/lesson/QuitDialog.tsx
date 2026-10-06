import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface QuitDialogProps {
  open: boolean;
  kind: "lesson" | "review" | "practice";
  onStay: () => void;
  onLeave: () => void;
}

export function QuitDialog({ open, kind, onStay, onLeave }: QuitDialogProps) {
  const what = kind === "lesson" ? "lesson" : "session";
  return (
    <Modal
      open={open}
      onClose={onStay}
      title={`Leave this ${what}?`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onLeave}>Leave</Button>
          <Button onClick={onStay}>Keep learning</Button>
        </>
      }
    >
      <p className="text-[17px] text-muted">
        You&apos;ll lose what you&apos;ve done in this {what} so far — but everything you completed before is safe.
      </p>
    </Modal>
  );
}
