import type { Metadata } from "next"
import Link from "next/link"

import { CareersApplicationForms } from "@/components/careers-application-forms"

export const metadata: Metadata = {
  title: "Careers",
}

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <p className="type-rolex-overline text-muted-foreground">Careers</p>
      <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
        Build with VVR
      </h1>
      <p className="mt-8 max-w-2xl text-pretty font-sans text-base leading-[1.9] text-muted-foreground">
        We work with people who value clarity, craft, and calm execution. Choose
        how you would like to engage — each path opens its own application form.
      </p>

      <CareersApplicationForms />

      <p className="mt-16 border-t border-black/10 pt-10 text-center text-sm text-muted-foreground">
        Prefer email?{" "}
        <Link
          href="mailto:talent@vvrindustries.com"
          className="text-foreground underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
        >
          talent@vvrindustries.com
        </Link>
      </p>
    </div>
  )
}
