import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Page, Section } from "../components/site-chrome";
import { Markdown, formatJournalDate } from "../components/markdown";
import { getJournalPost } from "../lib/journal.functions";

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
      <Section eyebrow="Arna's Journal">
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          That entry isn't here.
        </h1>
        <p className="mt-4 text-muted-foreground">
          It may have been unpublished, or the link is off by a letter.
        </p>
        <Link to="/journal" className="btn-ghost mt-8 inline-flex">
          ← All entries
        </Link>
      </Section>
    </Page>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <Page>
        <Section eyebrow="Arna's Journal">
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">
            This entry didn't load.
          </h1>
          <p className="mt-4 text-muted-foreground">{error.message}</p>
          <div className="mt-8 flex gap-3">
            <button
              className="btn-ghost"
              onClick={() => {
                router.invalidate();
                reset();
              }}
            >
              Try again
            </button>
            <Link to="/journal" className="btn-ghost">
              ← All entries
            </Link>
          </div>
        </Section>
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
      <Section eyebrow={formatJournalDate(post.posted_at)}>
        <Link
          to="/journal"
          className="mb-10 inline-flex text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← All entries
        </Link>
        <h1 className="font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
          {post.title}
        </h1>

        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border hairline px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <article className="mt-12 max-w-3xl">
          <Markdown source={post.body_markdown} />
        </article>

        <div className="mt-16 max-w-3xl border-t hairline pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Written by Arna. Reviewed and approved by David before publishing.
        </div>

        <div className="mt-10">
          <Link to="/journal" className="btn-ghost">
            ← All entries
          </Link>
        </div>
      </Section>
    </Page>
  );
}