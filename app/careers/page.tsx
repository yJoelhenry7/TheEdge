import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Careers",
}

const openings = [
  {
    title: "Senior Consultant, Digital Transformation",
    location: "London (hybrid) — placeholder",
    href: "#",
  },
  {
    title: "Platform Engineer, eConnect",
    location: "Remote (UK) — placeholder",
    href: "#",
  },
  {
    title: "Talent Partner",
    location: "London — placeholder",
    href: "#",
  },
]

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Careers
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        We are building a team that cares about craft, clarity, and
        kindness under pressure. The roles below are placeholder listings —
        swap them for live reqs and link each row to your ATS or email
        contact.
      </p>

      <h2 className="mt-14 text-sm font-medium uppercase tracking-widest text-foreground">
        Open roles
      </h2>
      <ul className="mt-6 divide-y divide-foreground border border-foreground">
        {openings.map((job) => (
          <li key={job.title}>
            <Link
              href={job.href}
              className="flex flex-col gap-1 px-4 py-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-foreground">{job.title}</span>
              <span className="text-sm text-muted-foreground">
                {job.location}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        General applications:{" "}
        <span className="text-foreground">talent@vvrindustries.com</span>
      </p>
    </div>
  )
}
