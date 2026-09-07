import { NextResponse } from "next/server"

import { generateInvoicePdf } from "@/lib/invoice-pdf"
import { parseInvoiceJson } from "@/lib/invoice-form-utils"

const MONTH_ABBREV = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const

function dayOrdinal(day: number) {
  const mod100 = day % 100
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

/** e.g. e.Bill ON6thSept2026.pdf */
function formatEBillFilename(invoiceDate: string) {
  const parsed = new Date(`${invoiceDate}T12:00:00`)
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed
  const day = dayOrdinal(date.getDate())
  const month = MONTH_ABBREV[date.getMonth()]
  const year = date.getFullYear()
  return `e.Bill ON${day}${month}${year}.pdf`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseInvoiceJson(body)

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { pdfBytes, invoiceNumber } = await generateInvoicePdf(parsed.payload)
    const filename = formatEBillFilename(parsed.payload.invoice_date)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Invoice-Number": invoiceNumber,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
