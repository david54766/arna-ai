import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";

type Props = {
  source?: string;
  label?: string;
  onSuccess?: () => void;
  centered?: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function WaitlistForm({ source = "site", label = "Join the waitlist", onSuccess, centered = true }: Props) {
  const submit = useServerFn(joinWaitlist);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const invalid = status.kind === "error";

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
        setStatus({ kind: "ok", message: "You're on the list — we'll be in touch." });
        setEmail("");
        onSuccess?.();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Try again." });
    }
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate style={centered ? undefined : { margin: "24px 0 0", justifyContent: "flex-start" }}>
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (invalid) setStatus({ kind: "idle" }); }}
        aria-invalid={invalid || undefined}
        aria-label="Email address"
        required
      />
      <button className="btn btn-primary" type="submit" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? "Joining…" : label}
      </button>
      <p
        className={`wl-note ${status.kind === "ok" ? "ok" : status.kind === "error" ? "err" : ""}`}
        role="status"
        aria-live="polite"
        style={{ flexBasis: "100%" }}
      >
        {status.kind === "ok" || status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
