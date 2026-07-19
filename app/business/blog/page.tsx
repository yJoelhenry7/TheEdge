import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thinking, perspectives, and practical frameworks from the VVR team — on consulting, platforms, media, investor relations, and operating with precision in a connected world.",
  alternates: { canonical: "https://vvrindustries.com/business/blog" },
  openGraph: {
    title: "The VVR Blog — Insights on consulting, platforms, and media",
    description:
      "Practical frameworks and perspectives from VVR Industries on consulting, connectivity, media, and what it takes to operate with precision.",
    url: "https://vvrindustries.com/business/blog",
  },
}

const placeholderPosts = [
  {
    slug: "#",
    category: "eConsulting",
    title: "How clarity at the start of a programme prevents rework at the end",
    excerpt:
      "Most programmes overrun because the problem wasn't scoped precisely enough on day one. We look at the questions every engagement should answer before work begins.",
    date: "Coming soon",
    readTime: "5 min read",
  },
  {
    slug: "#",
    category: "eConnect",
    title: "The hidden cost of disconnected platforms — and what composable architecture fixes",
    excerpt:
      "When systems don't talk to each other cleanly, the gap is filled with manual process, duplicate data, and brittle workarounds. Here's how eConnect approaches the problem.",
    date: "Coming soon",
    readTime: "7 min read",
  },
  {
    slug: "#",
    category: "eMedia Works",
    title: "Why brand voice matters more than brand visuals in a noisy market",
    excerpt:
      "Logos are forgotten. Language endures. We explore how consistent, precise brand voice builds recognition across every touchpoint your audience encounters.",
    date: "Coming soon",
    readTime: "4 min read",
  },
  {
    slug: "#",
    category: "eMarketing Services",
    title: "Performance marketing that doesn't sacrifice long-term brand equity",
    excerpt:
      "Short-term conversion campaigns and long-term brand building are not in conflict — but they require different measurement frameworks. We break down how to run both.",
    date: "Coming soon",
    readTime: "6 min read",
  },
  {
    slug: "#",
    category: "eInvestors",
    title: "What investors actually read in a stakeholder report",
    excerpt:
      "Most investor updates bury the lead. Based on patterns across portfolios, we outline what decision-makers prioritise and how to structure communications around it.",
    date: "Coming soon",
    readTime: "5 min read",
  },
  {
    slug: "#",
    category: "Operations",
    title: "Calm execution under pressure — the VVR operating model",
    excerpt:
      "Speed without structure creates chaos. We share the principles behind how VVR teams maintain pace and quality simultaneously, even when conditions change rapidly.",
    date: "Coming soon",
    readTime: "8 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl flex-1 px-4 py-16 sm:px-6">
      {/* Header */}
      <p className="type-rolex-overline text-muted-foreground">Business</p>
      <h1 className="mt-4 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
        The VVR blog
      </h1>
      <p className="mt-6 max-w-2xl text-pretty font-sans text-base leading-[1.9] text-muted-foreground">
        Thinking, perspectives, and practical frameworks from the VVR team — on
        consulting, platforms, media, and what it takes to operate with precision
        in a connected world.
      </p>

      {/* Coming soon banner */}
      <div className="mt-10 border border-black/10 bg-[#fafafa] px-6 py-5">
        <p className="font-sans text-xs font-normal uppercase tracking-[0.28em] text-muted-foreground">
          Launching soon
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
          Articles are in draft. The posts below are placeholder outlines — full
          content will be published shortly.
        </p>
      </div>

      {/* Post list */}
      <ul className="mt-12 divide-y divide-black/10">
        {placeholderPosts.map((post, index) => (
          <li key={index}>
            <Link
              href={post.slug}
              className="group block py-8 transition-opacity hover:opacity-70"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-sans text-[0.625rem] font-normal uppercase tracking-[0.28em] text-muted-foreground">
                  {post.category}
                </span>
                <span className="text-black/20">·</span>
                <span className="font-sans text-[0.625rem] font-normal text-muted-foreground">
                  {post.readTime}
                </span>
                <span className="text-black/20">·</span>
                <span className="font-sans text-[0.625rem] font-normal italic text-muted-foreground">
                  {post.date}
                </span>
              </div>
              <h2 className="mt-3 font-sans text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl">
                {post.title}
              </h2>
              <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
