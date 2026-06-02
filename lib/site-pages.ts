export type SitePage = {
  title: string
  href: string
  group?: string
  keywords?: string[]
}

export const sitePages: SitePage[] = [
  { title: "Home", href: "/", keywords: ["landing", "vvr", "home"] },
  { title: "About", href: "/about", keywords: ["company", "kkrv", "vvr", "co-founder", "co-founders"] },
  {
    title: "Locations",
    href: "/locations",
    keywords: ["delhi", "ravulapalem", "andhra pradesh", "offices", "map", "presence"],
  },
  {
    title: "The Edge solutions",
    href: "/business/the-edge-solutions",
    group: "Business",
    keywords: ["the edge", "solutions", "suite", "services", "vvr"],
  },
  {
    title: "eConsulting",
    href: "/business/e-consulting",
    group: "Business",
    keywords: ["consulting", "digital", "strategy"],
  },
  {
    title: "eConnect",
    href: "/business/e-connect",
    group: "Business",
    keywords: ["connect", "platform", "integration"],
  },
  {
    title: "Connect your bussiness with ePlatform?",
    href: "/business/connect-your-platform",
    group: "Business",
    keywords: ["integration", "partner", "api", "seller", "buyer"],
  },
  {
    title: "eMedia Works",
    href: "/business/e-media-works",
    group: "Business",
    keywords: ["media", "content", "production", "publishing", "creative"],
  },
  {
    title: "eInvestors",
    href: "/business/e-investors",
    group: "Business",
    keywords: ["investors", "investment", "portfolio", "relations", "stakeholders"],
  },
  {
    title: "eMarketing Services",
    href: "/business/e-marketing-services",
    group: "Business",
    keywords: ["marketing", "brand", "digital", "growth", "campaigns"],
  },
  {
    title: "Careers",
    href: "/careers",
    keywords: ["jobs", "hiring", "recruitment", "talent"],
  },
]
