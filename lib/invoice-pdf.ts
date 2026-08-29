import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import type { InvoicePdfPayload } from "@/lib/invoice-types"

const COMPANY_NAME = process.env.INVOICE_COMPANY_NAME || "VVR Industries Limited"
const COMPANY_PHONE = process.env.INVOICE_COMPANY_PHONE || "+91 0000000000"
const COMPANY_EMAIL = process.env.INVOICE_COMPANY_EMAIL || "info@vvrindustries.com"
const COMPANY_ADDRESS = process.env.INVOICE_COMPANY_ADDRESS || "India"

export type InvoicePdfResult = {
  pdfBytes: Uint8Array
  customerSlug: string
  fileTimePart: string
  invoiceNumber: string
}

/** pdf-lib StandardFonts only support WinAnsi; strip unsupported characters. */
export function sanitizePdfText(value: string) {
  return value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim()
}

function invoiceLineAmount(cost: number, offerAmount: number | null) {
  return offerAmount !== null ? offerAmount : cost
}

function formatCurrency(value: number) {
  return `INR ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

function formatIndianPhone(value: string | null | undefined) {
  const raw = (value ?? "").trim()
  if (!raw) return "N/A"
  if (raw.startsWith("+91")) return raw
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 10) return `+91 ${digits}`
  return `+91 ${raw}`
}

export async function generateInvoicePdf(payload: InvoicePdfPayload): Promise<InvoicePdfResult> {
  const treatmentRows = payload.items.map((item) => {
    const cost = Number.isNaN(Number(item.cost)) ? 0 : Number(item.cost)
    const offerRaw = item.offer_amount
    const offer_amount =
      offerRaw === null || offerRaw === undefined || offerRaw === ""
        ? null
        : Number.isNaN(Number(offerRaw))
          ? null
          : Number(offerRaw)
    return {
      treatment_name: item.treatment_name,
      treatment_date: item.treatment_date || null,
      cost,
      offer_amount,
      line_amount: invoiceLineAmount(cost, offer_amount),
    }
  })

  const showOfferCol = treatmentRows.some((item) => item.offer_amount !== null)
  const subtotal = treatmentRows.reduce((sum, item) => sum + item.line_amount, 0)
  const total = subtotal

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(1, 0.98, 0.9),
  })
  page.drawRectangle({
    x: 0,
    y: height - 132,
    width,
    height: 12,
    color: rgb(0.98, 0.95, 0.84),
  })

  page.drawCircle({ x: 46, y: height - 84, size: 14, color: rgb(0.12, 0.2, 0.35) })
  page.drawText("VVR", { x: 36, y: height - 88, size: 8, font: fontBold, color: rgb(1, 1, 1) })

  page.drawText(sanitizePdfText(COMPANY_NAME), {
    x: 86,
    y: height - 56,
    size: 16,
    font: fontBold,
    color: rgb(0.08, 0.14, 0.24),
  })
  page.drawText(`Phone Number: ${COMPANY_PHONE}`, {
    x: 86,
    y: height - 74,
    size: 8,
    font: fontRegular,
    color: rgb(0.28, 0.33, 0.4),
  })
  page.drawText(`Email: ${COMPANY_EMAIL}`, {
    x: 86,
    y: height - 84,
    size: 8,
    font: fontRegular,
    color: rgb(0.28, 0.33, 0.4),
  })
  page.drawText(`Address: ${sanitizePdfText(COMPANY_ADDRESS)}`, {
    x: 86,
    y: height - 94,
    size: 8,
    font: fontRegular,
    color: rgb(0.28, 0.33, 0.4),
  })

  const invoiceDate = new Date(payload.invoice_date)
  const formattedDate = Number.isNaN(invoiceDate.getTime())
    ? payload.invoice_date
    : invoiceDate.toLocaleDateString("en-IN")

  const invoiceNumber =
    payload.invoice_number.trim() ||
    `INV-${Date.now().toString(36).slice(-6).toUpperCase()}`

  page.drawText("INVOICE", {
    x: 430,
    y: height - 56,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  page.drawText(`Invoice #: ${sanitizePdfText(invoiceNumber)}`, {
    x: 430,
    y: height - 74,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText(`Date: ${formattedDate}`, {
    x: 430,
    y: height - 84,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })

  const now = new Date()
  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  page.drawText(`Time: ${formattedTime}`, {
    x: 430,
    y: height - 94,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawRectangle({
    x: 28,
    y: height - 280,
    width: width - 56,
    height: 96,
    borderColor: rgb(0.86, 0.88, 0.9),
    borderWidth: 1,
  })

  page.drawText("Customer Details", { x: 40, y: height - 200, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
  page.drawText(`Name: ${sanitizePdfText(payload.customer.full_name || "Customer")}`, {
    x: 40,
    y: height - 214,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  if (payload.customer.company) {
    page.drawText(`Company: ${sanitizePdfText(payload.customer.company)}`, {
      x: 40,
      y: height - 228,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    })
  }
  page.drawText(`Customer ID: ${sanitizePdfText(payload.customer.customer_id || "N/A")}`, {
    x: 300,
    y: height - 214,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText(`Email: ${sanitizePdfText(payload.customer.email || "N/A")}`, {
    x: 300,
    y: height - 228,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText(`Phone: ${formatIndianPhone(payload.customer.phone)}`, {
    x: 40,
    y: height - 242,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText(`Address: ${sanitizePdfText(payload.customer.address || "N/A")}`, {
    x: 40,
    y: height - 256,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })

  const tableX = 32
  const tableY = height - 340
  const tableWidth = width - 64
  const rowHeight = 28
  const showDateCol = payload.include_treatment_date !== false

  const colSNo = tableX + 10
  const colTreatment = tableX + 55
  const colDate = showDateCol ? (showOfferCol ? tableX + tableWidth - 330 : tableX + tableWidth - 210) : null
  const colAmount = showOfferCol ? tableX + tableWidth - 250 : null
  const colDiscount = showOfferCol ? tableX + tableWidth - 160 : null
  const colPayable = showOfferCol ? tableX + tableWidth - 70 : null
  const colCost = showOfferCol ? null : tableX + tableWidth - 90

  page.drawRectangle({ x: tableX, y: tableY, width: tableWidth, height: rowHeight, color: rgb(0.93, 0.95, 0.98) })
  page.drawText("S.No", { x: colSNo, y: tableY + 10, size: 10, font: fontBold })
  page.drawText("Description", { x: colTreatment, y: tableY + 10, size: 10, font: fontBold })
  if (showDateCol && colDate !== null) {
    page.drawText("Date", { x: colDate, y: tableY + 10, size: 10, font: fontBold })
  }
  if (showOfferCol && colAmount !== null && colDiscount !== null && colPayable !== null) {
    page.drawText("Amount", { x: colAmount, y: tableY + 10, size: 10, font: fontBold })
    page.drawText("Discount %", { x: colDiscount, y: tableY + 10, size: 10, font: fontBold })
    page.drawText("Payable", { x: colPayable, y: tableY + 10, size: 10, font: fontBold })
  } else if (colCost !== null) {
    page.drawText("Cost", { x: colCost, y: tableY + 10, size: 10, font: fontBold })
  }

  treatmentRows.forEach((item, index) => {
    const rowY = tableY - rowHeight * (index + 1)
    page.drawRectangle({
      x: tableX,
      y: rowY,
      width: tableWidth,
      height: rowHeight,
      borderColor: rgb(0.86, 0.88, 0.9),
      borderWidth: 1,
    })
    page.drawText(String(index + 1), {
      x: colSNo + 4,
      y: rowY + 10,
      size: 10,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    })
    const nameMaxLen = showOfferCol ? (showDateCol ? 18 : 26) : showDateCol ? 40 : 62
    page.drawText(sanitizePdfText(item.treatment_name).slice(0, nameMaxLen), {
      x: colTreatment,
      y: rowY + 10,
      size: 10,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    })
    if (showDateCol && colDate !== null) {
      const formattedTreatmentDate = item.treatment_date
        ? (() => {
            const d = new Date(item.treatment_date)
            return Number.isNaN(d.getTime()) ? item.treatment_date : d.toLocaleDateString("en-IN")
          })()
        : "-"
      page.drawText(formattedTreatmentDate, {
        x: colDate,
        y: rowY + 10,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      })
    }
    if (showOfferCol && colAmount !== null && colDiscount !== null && colPayable !== null) {
      const discountValue = item.offer_amount !== null ? Math.max(0, item.cost - item.offer_amount) : 0
      const discountPercent = discountValue > 0 && item.cost > 0 ? (discountValue / item.cost) * 100 : 0
      page.drawText(formatCurrency(item.cost), {
        x: colAmount,
        y: rowY + 10,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      })
      page.drawText(discountPercent > 0 ? `${Number(discountPercent.toFixed(2))}%` : "-", {
        x: colDiscount,
        y: rowY + 10,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      })
      page.drawText(formatCurrency(item.line_amount), {
        x: colPayable,
        y: rowY + 10,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      })
    } else if (colCost !== null) {
      page.drawText(formatCurrency(item.line_amount), {
        x: colCost,
        y: rowY + 10,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
      })
    }
  })

  const summaryLabelX = tableX + tableWidth - (showOfferCol ? 160 : 170)
  const summaryValueX = tableX + tableWidth - (showOfferCol ? 70 : 90)
  const summaryStartY = tableY - rowHeight * (treatmentRows.length + 1) - 22
  page.drawText("Subtotal", {
    x: summaryLabelX,
    y: summaryStartY,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText(formatCurrency(subtotal), {
    x: summaryValueX,
    y: summaryStartY,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  page.drawText("Total", {
    x: summaryLabelX,
    y: summaryStartY - 16,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  page.drawText(formatCurrency(total), {
    x: summaryValueX,
    y: summaryStartY - 16,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })

  const normalizedPaymentMethod = (payload.payment_method ?? "").toLowerCase()
  let footerY = 110
  if (payload.payment_method) {
    page.drawText(`Payment Method: ${normalizedPaymentMethod.toUpperCase().replace("_", " ")}`, {
      x: 32,
      y: footerY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    })
    footerY -= 14
  }

  page.drawText(`Status: ${payload.status.toUpperCase()}`, {
    x: 32,
    y: footerY,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  })
  footerY -= 14

  if (normalizedPaymentMethod === "upi" && payload.upi_transaction_id) {
    page.drawText(`UPI Txn ID: ${sanitizePdfText(payload.upi_transaction_id)}`, {
      x: 32,
      y: footerY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    })
  }

  page.drawText(`Thank you for choosing ${sanitizePdfText(COMPANY_NAME)}.`, {
    x: 32,
    y: 60,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  })
  page.drawText(`For any enquiries, contact: ${COMPANY_EMAIL} | ${COMPANY_PHONE}`, {
    x: 32,
    y: 46,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  })

  const customerSlug =
    sanitizePdfText(payload.customer.full_name || "Customer")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "Customer"
  const fileTimePart = formattedTime.replace(/[:\s]/g, "-").replace(/\./g, "").toUpperCase()

  pdfDoc.setTitle(
    `Invoice - ${payload.customer.full_name || "Customer"} - ${payload.invoice_date} ${formattedTime}`
  )

  const pdfBytes = await pdfDoc.save()

  return { pdfBytes, customerSlug, fileTimePart, invoiceNumber }
}
