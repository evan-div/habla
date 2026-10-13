"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";

const inputClass =
  "h-12 w-full rounded-2xl border-2 border-line-strong bg-surface px-4 font-bold outline-none placeholder:font-medium placeholder:text-faint focus:border-teal-500";

export function TextField({ label, hint, ...props }: ComponentProps<"input"> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="font-extrabold">{label}</label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={`mt-1.5 ${inputClass}`} {...props} />
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function PasswordField({ label, hint, ...props }: Omit<ComponentProps<"input">, "type"> & { label: string; hint?: string }) {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="font-extrabold">{label}</label>
      <div className="relative mt-1.5">
        <input id={id} type={shown ? "text" : "password"} aria-describedby={hint ? `${id}-hint` : undefined} className={`${inputClass} pr-12`} {...props} />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
          className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-surface-2"
        >
          {shown ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
