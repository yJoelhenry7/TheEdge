import { NextResponse } from "next/server"

import { generateInvoicePdf } from "@/lib/invoice-pdf"
import { parseInvoiceJson } from "@/lib/invoice-form-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseInvoiceJson(body)

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { pdfBytes, customerSlug, fileTimePart, invoiceNumber } = await generateInvoicePdf(parsed.payload)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${customerSlug}-${parsed.payload.invoice_date}-${fileTimePart}.pdf"`,
        "Cache-Control": "no-store",
        "X-Invoice-Number": invoiceNumber,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
