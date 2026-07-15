CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'site',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT waitlist_email_length CHECK (char_length(email) <= 254),
  CONSTRAINT waitlist_source_length CHECK (char_length(source) <= 32)
);

GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Anyone may add themselves; no read/update/delete allowed for public roles.
CREATE POLICY "Anyone can join the waitlist"
  ON public.waitlist_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX waitlist_signups_created_at_idx ON public.waitlist_signups (created_at DESC);