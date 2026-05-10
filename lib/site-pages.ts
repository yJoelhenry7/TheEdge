export type SitePage = {
  title: string
  href: string
  group?: string
  keywords?: string[]
}

export const sitePages: SitePage[] = [
  { title: "Home", href: "/", keywords: ["landing", "theedge"] },
  { title: "About", href: "/about", keywords: ["company", "directors"] },
  {
    title: "eConsulting",
    href: "/business/e-consulting",
    group: "Business",
    keywords: ["consulting", "digital"],
  },
  {
    title: "eConnect",
    href: "/business/e-connect",
    group: "Business",
    keywords: ["connect", "platform"],
  },
  {
    title: "Connect your platform with eConnect?",
    href: "/business/connect-your-platform",
    group: "Business",
    keywords: ["integration", "partner", "api"],
  },
  {
    title: "Careers",
    href: "/careers",
    keywords: ["jobs", "hiring", "recruitment"],
  },
]
