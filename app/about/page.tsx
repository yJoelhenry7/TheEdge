import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
}

const directors = [
  {
    name: "Alex Morgan",
    role: "Chief Executive Officer",
    bio: "Placeholder — former strategy lead at a global consultancy; focuses on operating models and growth.",
  },
  {
    name: "Priya Shah",
    role: "Chief Operating Officer",
    bio: "Placeholder — background in enterprise delivery and programme assurance across regulated sectors.",
  },
  {
    name: "Daniel Okonkwo",
    role: "Chief Technology Officer",
    bio: "Placeholder — product and platform architecture; interested in interoperability and long-term maintainability.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        About TheEdge
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        TheEdge is a placeholder company profile for this demo site. Copy
        here would describe your history, footprint, and what clients can
        expect when they work with you — written in your voice, with real
        facts instead of lorem ipsum.
      </p>
      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
        Mission (placeholder): help teams reduce friction between strategy
        and delivery, and between systems that were never designed to work
        together.
      </p>

      <h2 className="mt-14 text-sm font-medium uppercase tracking-widest text-foreground">
        Leadership
      </h2>
      <ul className="mt-8 space-y-10">
        {directors.map((d) => (
          <li key={d.name} className="border-b border-foreground pb-10 last:border-0">
            <p className="font-semibold text-foreground">{d.name}</p>
            <p className="text-sm text-muted-foreground">{d.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {d.bio}
            </p>
          </li>
        ))}
      </ul>

      <h2
        id="presence"
        className="mt-14 scroll-mt-24 text-sm font-medium uppercase tracking-widest text-foreground"
      >
        Presence
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        London · Remote delivery across Europe (placeholder).
      </p>

      <h2 className="mt-14 text-sm font-medium uppercase tracking-widest text-foreground">
        Registered details
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        TheEdge Group Ltd (placeholder)
        <br />
        Company no. 00000000 · Registered office: 00 Example Street, London
        <br />
        VAT: GB000000000
      </p>
    </div>
  )
}
