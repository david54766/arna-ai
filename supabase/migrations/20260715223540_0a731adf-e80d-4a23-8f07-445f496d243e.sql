
CREATE TABLE public.journal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body_markdown text NOT NULL,
  excerpt text,
  posted_at timestamptz NOT NULL DEFAULT now(),
  author text NOT NULL DEFAULT 'Arna',
  tags text[] NOT NULL DEFAULT '{}'::text[]
);

GRANT SELECT ON public.journal_posts TO anon;
GRANT SELECT ON public.journal_posts TO authenticated;
GRANT ALL ON public.journal_posts TO service_role;

ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Journal posts are publicly readable"
  ON public.journal_posts FOR SELECT
  USING (true);

CREATE INDEX journal_posts_posted_at_idx ON public.journal_posts (posted_at DESC);
