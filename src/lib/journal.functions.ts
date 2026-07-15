import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  body_markdown: string;
  excerpt: string | null;
  posted_at: string;
  author: string;
  tags: string[];
};

function client() {
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

export const listJournalPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<JournalPost[]> => {
    const { data, error } = await client()
      .from("journal_posts")
      .select("id, slug, title, body_markdown, excerpt, posted_at, author, tags")
      .order("posted_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as JournalPost[];
  },
);

export const getJournalPost = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<JournalPost | null> => {
    const { data: row, error } = await client()
      .from("journal_posts")
      .select("id, slug, title, body_markdown, excerpt, posted_at, author, tags")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as JournalPost | null;
  });