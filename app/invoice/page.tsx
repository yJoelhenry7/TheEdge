import type { Metadata } from "next"

import { InvoiceForm } from "@/components/invoice-form"

export const metadata: Metadata = {
  title: "Generate invoice",
  description: "Create and download a treatment invoice PDF from form details.",
  alternates: { canonical: "https://vvrindustries.com/invoice" },
  robots: { index: false, follow: false },
}

export default function InvoicePage() {
  return (
    <div className="mx-auto max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <p className="type-rolex-overline text-muted-foreground">Tools</p>
      <h1 className="mt-4 font-sans text-3xl font-medium tracking-tight text-foreground">Generate invoice</h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
        Fill in customer and line item details below to generate a downloadable invoice PDF. No data is stored —
        everything is taken from this form.
      </p>

      <div className="mt-12">
        <InvoiceForm />
      </div>
    </div>
  )
}
