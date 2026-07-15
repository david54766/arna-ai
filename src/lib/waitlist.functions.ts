import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Please enter a valid email address." })
  .max(254);

const SourceSchema = z
  .string()
  .trim()
  .max(32)
  .regex(/^[a-z0-9_-]+$/i, "Invalid source.")
  .default("site");

const InputSchema = z.object({
  email: EmailSchema,
  source: SourceSchema.optional(),
});

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type JoinWaitlistResult = { ok: true } | { ok: false; error: string };

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((raw) => InputSchema.parse(raw))
  .handler(async ({ data }): Promise<JoinWaitlistResult> => {
    const source = data.source ?? "site";

    const { error } = await serverClient()
      .from("waitlist_signups")
      .insert({ email: data.email, source });

    if (error) {
      // Structured so we can later hook Resend (noreply@thearnaproject.com) here
      // without changing the client contract.
      console.error("[waitlist] insert failed", error);
      return { ok: false, error: "We couldn't save that just now. Try again in a moment." };
    }

    // TODO: enqueue Resend confirmation from noreply@thearnaproject.com once wired.
    return { ok: true };
  });