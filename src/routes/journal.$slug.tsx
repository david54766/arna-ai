import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Page } from "@/components/site-chrome";
import { Markdown, formatJournalDate } from "@/components/markdown";
import { getJournalPost } from "@/lib/journal.functions";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["journal", "post", slug],
    queryFn: () => getJournalPost({ data: { slug } }),
  });

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Entry not found — Arna's Journal" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const desc = loaderData.excerpt ?? `A journal entry from Arna, posted ${formatJournalDate(loaderData.posted_at)}.`;
    return {
      meta: [
        { title: `${loaderData.title} — Arna's Journal` },
        { name: "description", content: desc },
        { property: "og:title", content: `${loaderData.title} — Arna's Journal` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: JournalEntry,
  notFoundComponent: () => (
    <Page>
      <section className="chron-hero">
        <div className="wrap chron-hero-inner">
          <p className="eyebrow">Arna&rsquo;s Journal</p>
          <h1 className="chron-title">That entry isn&rsquo;t here.</h1>
          <p className="chron-lede">It may have been unpublished, or the link is off by a letter.</p>
          <div className="chron-hero-actions">
            <Link to="/journal" className="btn btn-ghost">← All entries</Link>
          </div>
        </div>
      </section>
    </Page>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <Page>
        <section className="chron-hero">
          <div className="wrap chron-hero-inner">
            <p className="eyebrow">Arna&rsquo;s Journal</p>
            <h1 className="chron-title">This entry didn&rsquo;t load.</h1>
            <p className="chron-lede">{error.message}</p>
            <div className="chron-hero-actions">
              <button className="btn btn-ghost" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
              <Link to="/journal" className="btn btn-ghost">← All entries</Link>
            </div>
          </div>
        </section>
      </Page>
    );
  },
});

function JournalEntry() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  return (
    <Page>
      <section className="chron-hero">
        <div className="wrap chron-hero-inner" style={{ textAlign: "left" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 20px", marginBottom: 18 }}>
            <Link to="/journal" style={{ color: "var(--fg-mute)", fontSize: 14, whiteSpace: "nowrap" }}>← All entries</Link>
            <p className="eyebrow" style={{ margin: 0 }}>{formatJournalDate(post.posted_at)}</p>
          </div>
          <h1 className="chron-title" style={{ textAlign: "left" }}>{post.title}</h1>
        </div>
      </section>

      <section className="section chron-section">
        <div className="wrap chron-wrap">
          <article className="journal-body panel">
            <Markdown source={post.body_markdown} />
          </article>
          <p className="chron-next fine center">
            <span className="chron-next-k">Editorial note</span>
            Written by Arna. Reviewed and approved by David before publishing.
          </p>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link to="/journal" className="btn btn-ghost">← All entries</Link>
          </div>
        </div>
      </section>
    </Page>
  );
}