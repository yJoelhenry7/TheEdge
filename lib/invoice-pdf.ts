import { promises as fs } from "fs"
import path from "path"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"

import type { InvoicePdfPayload } from "@/lib/invoice-types"

const FROM_COMPANY =
  process.env.INVOICE_COMPANY_NAME || "VENKANNA VENKATA RAMANA INDUSTRIES LIMITED."

export type InvoicePdfResult = {
  pdfBytes: Uint8Array
  invoiceNumber: string
}

/** pdf-lib StandardFonts only support WinAnsi; strip unsupported characters. */
export function sanitizePdfText(value: string) {
  return value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim()
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatInvoiceDate(invoiceDate: string) {
  const parsed = new Date(`${invoiceDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return invoiceDate
  const dd = String(parsed.getDate()).padStart(2, "0")
  const mm = String(parsed.getMonth() + 1).padStart(2, "0")
  const yyyy = parsed.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

function drawRightAlignedText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  options: {
    right: number
    y: number
    size: number
    font: Awaited<ReturnType<PDFDocument["embedFont"]>>
    color: ReturnType<typeof rgb>
  }
) {
  const width = options.font.widthOfTextAtSize(text, options.size)
  page.drawText(text, {
    x: options.right - width,
    y: options.y,
    size: options.size,
    font: options.font,
    color: options.color,
  })
}

async function embedPngFromPublic(pdfDoc: PDFDocument, filename: string) {
  try {
    const filePath = path.join(process.cwd(), "public", filename)
    const bytes = await fs.readFile(filePath)
    return await pdfDoc.embedPng(bytes)
  } catch {
    return null
  }
}

export async function generateInvoicePdf(payload: InvoicePdfPayload): Promise<InvoicePdfResult> {
  const items = payload.items.map((item) => ({
    description: sanitizePdfText(item.description),
    amount: Number.isNaN(Number(item.amount)) ? 0 : Number(item.amount),
  }))

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const serviceCharges = Number.isNaN(Number(payload.e_service_charges))
    ? 0
    : Number(payload.e_service_charges)
  const igstRate = Number.isNaN(Number(payload.igst_rate)) ? 18 : Number(payload.igst_rate)
  const igstBase = subtotal + serviceCharges
  const igstAmount = payload.charge_igst ? (igstBase * igstRate) / 100 : 0
  const total = igstBase + igstAmount

  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  const black = rgb(0, 0, 0)
  const red = rgb(0.86, 0.08, 0.1)
  const taxBlue = rgb(0.45, 0.72, 0.88)
  const left = 48
  const right = width - 48

  // FROM,
  page.drawText("FROM,", {
    x: left,
    y: height - 56,
    size: 10,
    font: fontBold,
    color: black,
  })
  page.drawText(sanitizePdfText(FROM_COMPANY), {
    x: left,
    y: height - 72,
    size: 10,
    font: fontBold,
    color: black,
  })

  // TAX INVOICE (top right, light blue)
  drawRightAlignedText(page, "TAX INVOICE", {
    right,
    y: height - 56,
    size: 14,
    font: fontBold,
    color: taxBlue,
  })

  // THE. brand mark
  page.drawText("THE.", {
    x: left,
    y: height - 150,
    size: 56,
    font: fontSerifBold,
    color: red,
  })

  // ORDER ID
  page.drawText("ORDER ID", {
    x: right - 120,
    y: height - 110,
    size: 10,
    font: fontBold,
    color: black,
  })
  if (payload.order_id) {
    page.drawText(sanitizePdfText(payload.order_id), {
      x: right - 120,
      y: height - 126,
      size: 10,
      font: fontRegular,
      color: black,
    })
  }

  // E ID NUMBER + payment mode
  const eIdLabel = "E ID NUMBER :"
  page.drawText(eIdLabel, {
    x: left,
    y: height - 180,
    size: 10,
    font: fontBold,
    color: black,
  })
  const eIdValue = sanitizePdfText(payload.e_id_number || "81886889")
  const eIdLabelWidth = fontBold.widthOfTextAtSize(eIdLabel, 10)
  page.drawText(eIdValue, {
    x: left + eIdLabelWidth + 10,
    y: height - 180,
    size: 10,
    font: fontRegular,
    color: black,
  })
  page.drawText(
    `PAYMENT MODE : ${sanitizePdfText(payload.payment_method || "CASH").toUpperCase()}`,
    {
      x: left,
      y: height - 196,
      size: 10,
      font: fontBold,
      color: black,
    }
  )

  // INVOICE DATE
  page.drawText("INVOICE DATE", {
    x: right - 120,
    y: height - 170,
    size: 11,
    font: fontBold,
    color: black,
  })
  page.drawText(formatInvoiceDate(payload.invoice_date), {
    x: right - 120,
    y: height - 188,
    size: 11,
    font: fontRegular,
    color: black,
  })

  // BILLED TO
  let billedY = height - 250
  page.drawText("BILLED TO,", {
    x: left,
    y: billedY,
    size: 11,
    font: fontBold,
    color: black,
  })
  billedY -= 20

  if (payload.billed_to.gstin) {
    page.drawText(`GSTIN:- ${sanitizePdfText(payload.billed_to.gstin)}`, {
      x: left,
      y: billedY,
      size: 10,
      font: fontRegular,
      color: black,
    })
    billedY -= 16
  }

  page.drawText(sanitizePdfText(payload.billed_to.name).toUpperCase(), {
    x: left,
    y: billedY,
    size: 10,
    font: fontRegular,
    color: black,
  })
  billedY -= 16

  if (payload.billed_to.address) {
    const addressLines = sanitizePdfText(payload.billed_to.address)
      .toUpperCase()
      .split(/\n|,/)
      .map((line) => line.trim())
      .filter(Boolean)
    for (const line of addressLines) {
      page.drawText(line, {
        x: left,
        y: billedY,
        size: 10,
        font: fontRegular,
        color: black,
      })
      billedY -= 16
    }
  }

  page.drawText(sanitizePdfText(payload.billed_to.country || "IND.").toUpperCase(), {
    x: left,
    y: billedY,
    size: 10,
    font: fontRegular,
    color: black,
  })

  // Amounts table: source | description | amount (aligned columns, no border)
  const serviceLabel = sanitizePdfText(payload.service_label || "THE STORE")
  const serviceFrom = sanitizePdfText(payload.service_from || "FROM eSERVICES")
  const colSourceX = left
  const colDescX = left + 118
  const colAmountRight = right
  const colLabelX = left + 118
  const rowGap = 18
  const stampReserve = 190
  const tableBottom = stampReserve + 24
  const descMaxWidth = colAmountRight - colDescX - 90

  function fitDescription(text: string, maxWidth: number) {
    const upper = text.toUpperCase()
    let fitted = upper
    while (fitted.length > 0 && fontRegular.widthOfTextAtSize(fitted, 10) > maxWidth) {
      fitted = fitted.slice(0, -1)
    }
    if (fitted.length < upper.length && fitted.length > 3) {
      return `${fitted.slice(0, -3).trimEnd()}...`
    }
    return fitted
  }

  function ensureTableSpace(needed: number) {
    if (lineY - needed >= tableBottom) return
    page = pdfDoc.addPage([595, 842])
    sourceDrawnOnPage = false
    lineY = height - 72
    page.drawText("TAX INVOICE (continued)", {
      x: left,
      y: lineY,
      size: 11,
      font: fontBold,
      color: taxBlue,
    })
    lineY -= 36
  }

  let lineY = Math.min(billedY - 48, height - 420)
  let sourceDrawnOnPage = false

  items.forEach((item) => {
    ensureTableSpace(rowGap + (sourceDrawnOnPage ? 0 : 8))

    if (!sourceDrawnOnPage) {
      page.drawText(serviceLabel, {
        x: colSourceX,
        y: lineY,
        size: 11,
        font: fontBold,
        color: black,
      })
      page.drawText(serviceFrom, {
        x: colSourceX,
        y: lineY - 13,
        size: 9,
        font: fontRegular,
        color: black,
      })
      sourceDrawnOnPage = true
    }

    page.drawText(fitDescription(item.description, descMaxWidth), {
      x: colDescX,
      y: lineY,
      size: 10,
      font: fontRegular,
      color: black,
    })
    drawRightAlignedText(page, formatAmount(item.amount), {
      right: colAmountRight,
      y: lineY,
      size: 11,
      font: fontBold,
      color: black,
    })
    lineY -= rowGap
  })

  // Summary rows share the same description/amount columns
  ensureTableSpace(rowGap * 4 + 20)
  lineY -= 10

  const summaryRows: Array<{
    label: string
    amount: number
    amountFont: typeof fontBold | typeof fontRegular
  }> = [
    { label: "SUBTOTAL", amount: subtotal, amountFont: fontBold },
    { label: "e.SERVICE CHARGES", amount: serviceCharges, amountFont: fontRegular },
    {
      label: `IGST CHARGED AT ${Number(igstRate.toFixed(2))}%`,
      amount: igstAmount,
      amountFont: fontRegular,
    },
  ]

  for (const row of summaryRows) {
    ensureTableSpace(rowGap)
    page.drawText(row.label, {
      x: colLabelX,
      y: lineY,
      size: 10,
      font: fontBold,
      color: black,
    })
    drawRightAlignedText(page, formatAmount(row.amount), {
      right: colAmountRight,
      y: lineY,
      size: 11,
      font: row.amountFont,
      color: black,
    })
    lineY -= rowGap
  }

  ensureTableSpace(rowGap + 8)
  lineY -= 6
  page.drawText("TOTAL eBILL", {
    x: colSourceX,
    y: lineY,
    size: 12,
    font: fontBold,
    color: black,
  })
  drawRightAlignedText(page, formatAmount(total), {
    right: colAmountRight,
    y: lineY,
    size: 13,
    font: fontBold,
    color: black,
  })

  // Founder stamp + signature at bottom right of the last page
  const stampImage = await embedPngFromPublic(pdfDoc, "stamp.png")
  const signatureImage = await embedPngFromPublic(pdfDoc, "signature.png")

  const stampAreaX = right - 170
  const stampAreaY = 108

  if (stampImage) {
    const stampDims = stampImage.scale(0.22)
    page.drawImage(stampImage, {
      x: stampAreaX,
      y: stampAreaY,
      width: stampDims.width,
      height: stampDims.height,
      rotate: degrees(-4),
    })
  }

  if (signatureImage) {
    const signatureDims = signatureImage.scale(0.28)
    page.drawImage(signatureImage, {
      x: stampAreaX + 22,
      y: stampAreaY + 2,
      width: signatureDims.width,
      height: signatureDims.height,
      rotate: degrees(8),
    })
  }

  page.drawText("Authorised Signatory", {
    x: stampAreaX + 20,
    y: 94,
    size: 8,
    font: fontRegular,
    color: black,
  })

  // Standard invoice footer — company address & contact
  const footerMuted = rgb(0.3, 0.3, 0.3)
  const companyPhone = process.env.INVOICE_COMPANY_PHONE || "+91 82891 252"
  const companyEmail = process.env.INVOICE_COMPANY_EMAIL || "info@vvrindustries.com"
  const companyAddress =
    process.env.INVOICE_COMPANY_ADDRESS ||
    "Ravulapalem, Andhra Pradesh 533238 | Delhi, India"

  page.drawText(`Thank you for choosing ${sanitizePdfText(FROM_COMPANY.replace(/\.$/, ""))}.`, {
    x: left,
    y: 52,
    size: 9,
    font: fontRegular,
    color: footerMuted,
  })
  page.drawText(`Address: ${sanitizePdfText(companyAddress)}`, {
    x: left,
    y: 38,
    size: 8,
    font: fontRegular,
    color: footerMuted,
  })
  page.drawText(`For any enquiries: ${companyEmail} | ${companyPhone}`, {
    x: left,
    y: 26,
    size: 8,
    font: fontRegular,
    color: footerMuted,
  })

  const invoiceNumber = payload.order_id || payload.e_id_number || formatInvoiceDate(payload.invoice_date)
  pdfDoc.setTitle(`Tax Invoice - ${payload.billed_to.name} - ${payload.invoice_date}`)

  const pdfBytes = await pdfDoc.save()
  return { pdfBytes, invoiceNumber }
}
