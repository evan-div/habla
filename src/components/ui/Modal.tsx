"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/util/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it still names the dialog for assistive tech). */
  hideTitle?: boolean;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
}

const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" } as const;

/** Accessible modal built on the native <dialog>: focus trap, Esc to close, inert background. */
export function Modal({ open, onClose, title, hideTitle, size = "md", children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-1.5rem)] rounded-3xl border-2 border-line bg-surface p-0 text-ink shadow-pop open:animate-pop",
        "max-h-[min(88dvh,46rem)] overflow-hidden",
        widths[size],
      )}
    >
      {open && (
        <div className="flex max-h-[inherit] flex-col">
          <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6", hideTitle && "sr-only")}>
            <h2 id={titleId} className="text-2xl font-extrabold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-3 sm:px-7 sm:pb-6">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-3 border-t-2 border-line bg-surface-2 px-5 py-4 sm:px-7">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
