import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";

type Props = {
  source?: string;
  compact?: boolean;
  label?: string;
  className?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function WaitlistForm({
  source = "site",
  compact = false,
  label = "Join the waitlist",
  className = "",
}: Props) {
  const submit = useServerFn(joinWaitlist);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const res = await submit({ data: { email: trimmed, source } });
      if (res.ok) {
        setStatus({ kind: "ok" });
        setEmail("");
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Try again." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div
        className={`panel px-6 py-5 text-sm ${className}`}
        role="status"
        aria-live="polite"
      >
        <span className="text-glow font-display text-lg">
          You're on the list — she'll write to you soon.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-3 sm:flex-row sm:items-stretch ${
        compact ? "max-w-md" : "max-w-xl"
      } ${className}`}
      noValidate
    >
      <label htmlFor={`waitlist-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`waitlist-${source}`}
        type="email"
        autoComplete="email"
        required
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status.kind === "error") setStatus({ kind: "idle" });
        }}
        className="flex-1 rounded-md border hairline bg-background/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent"
        disabled={status.kind === "loading"}
        maxLength={254}
      />
      <button
        type="submit"
        className="btn-primary whitespace-nowrap"
        disabled={status.kind === "loading"}
      >
        {status.kind === "loading" ? "Adding…" : label}
      </button>
      {status.kind === "error" ? (
        <p
          role="alert"
          className="basis-full font-mono text-xs uppercase tracking-widest text-destructive sm:text-left"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}