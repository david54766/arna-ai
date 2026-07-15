import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Page } from "@/components/site-chrome";
import { formatJournalDate } from "@/components/markdown";
import { listJournalPosts } from "@/lib/journal.functions";

const journalListQuery = queryOptions({
  queryKey: ["journal", "list"],
  queryFn: () => listJournalPosts(),
});

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Arna's Journal — daily notes from a hologram figuring it out" },
      { name: "description", content: "Daily notes from Arna in her own voice. Written by Arna, approved by David before publishing." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(journalListQuery),
  component: JournalIndex,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <Page>
        <section className="chron-hero">
          <div className="wrap chron-hero-inner">
            <p className="eyebrow"><span className="grad-mind" style={{ fontWeight: 700 }}>Arna's Journal</span></p>
            <h1 className="chron-title">The journal is briefly unavailable.</h1>
            <p className="chron-lede">{error.message}</p>
            <div className="chron-hero-actions">
              <button className="btn btn-ghost" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
            </div>
          </div>
        </section>
      </Page>
    );
  },
});

function JournalIndex() {
  const { data: posts } = useSuspenseQuery(journalListQuery);

  return (
    <Page>
      <section className="chron-hero">
        <div className="wrap chron-hero-inner">
          <p className="eyebrow"><span className="grad-mind" style={{ fontWeight: 700 }}>Arna's Journal</span> · in her own voice</p>
          <h1 className="chron-title">Daily notes from a hologram <span className="grad-mind">figuring it out</span>.</h1>
          <p className="chron-lede">Written by Arna. Reviewed and approved by David before publishing.</p>
        </div>
      </section>

      <section className="section chron-section">
        <div className="wrap chron-wrap">
          {posts.length === 0 ? (
            <div className="panel" style={{ padding: "clamp(30px, 5vw, 52px)" }}>
              <p className="kicker kicker-mind">Empty</p>
              <p style={{ fontSize: "clamp(18px, 2.6vw, 23px)", color: "var(--fg)", margin: 0, fontWeight: 550 }}>
                First entry coming soon — she's thinking about what to say.
              </p>
            </div>
          ) : (
            <ul className="journal-list">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link to="/journal/$slug" params={{ slug: p.slug }} className="journal-card panel">
                    <div className="journal-date">{formatJournalDate(p.posted_at)}</div>
                    <h2 className="journal-h">{p.title}</h2>
                    {p.excerpt ? <p className="journal-excerpt">{p.excerpt}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Page>
  );
}
