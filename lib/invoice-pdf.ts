import { promises as fs } from "fs"
import path from "path"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import { PNG } from "pngjs"

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

/** Make signature ink solid black and remove dark background for clear visibility. */
async function embedSignatureFromPublic(pdfDoc: PDFDocument) {
  try {
    const candidates = ["signature.jpg", "signature.png"]
    let width = 0
    let height = 0
    let data: Buffer | null = null

    for (const name of candidates) {
      try {
        const filePath = path.join(process.cwd(), "public", name)
        const bytes = await fs.readFile(filePath)
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
          const jpeg = await import("jpeg-js")
          const decoded = jpeg.decode(bytes, { useTArray: true })
          width = decoded.width
          height = decoded.height
          data = Buffer.from(decoded.data)
        } else {
          const png = PNG.sync.read(Buffer.from(bytes))
          width = png.width
          height = png.height
          data = Buffer.from(png.data)
        }
        break
      } catch {
        // try next candidate
      }
    }

    if (!data || !width || !height) {
      return null
    }

    // Sample corners to detect whether the background is dark or light
    const sample = (x: number, y: number) => {
      const i = (y * width + x) * 4
      return 0.2126 * data![i] + 0.7152 * data![i + 1] + 0.0722 * data![i + 2]
    }
    const cornerL =
      (sample(2, 2) +
        sample(width - 3, 2) +
        sample(2, height - 3) +
        sample(width - 3, height - 3)) /
      4
    const darkBackground = cornerL < 80

    const out = new PNG({ width, height })
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const maxC = Math.max(r, g, b)
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

      let isInk = false
      if (darkBackground) {
        // Dark navy / blue strokes on black — keep any pixel with visible channel lift
        isInk = maxC > 28 || b > r + 8 || b > g + 8
      } else {
        // Dark ink on light paper
        isInk = luminance < 175
      }

      if (!isInk) {
        out.data[i] = 255
        out.data[i + 1] = 255
        out.data[i + 2] = 255
        out.data[i + 3] = 0
        continue
      }

      // Solid near-black ink for maximum contrast on the invoice
      out.data[i] = 0
      out.data[i + 1] = 0
      out.data[i + 2] = 0
      out.data[i + 3] = 255
    }

    const cleaned = PNG.sync.write(out)
    return await pdfDoc.embedPng(cleaned)
  } catch {
    return embedPngFromPublic(pdfDoc, "signature.png")
  }
}

function fitImage(
  image: { width: number; height: number },
  maxWidth: number,
  maxHeight: number
) {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height)
  return {
    width: image.width * scale,
    height: image.height * scale,
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

  const black = rgb(0, 0, 0)
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

  // Lion logo brand mark (replaces THE.)
  const logoImage = await embedPngFromPublic(pdfDoc, "logo.png")
  if (logoImage) {
    const logoDims = fitImage(logoImage, 110, 90)
    page.drawImage(logoImage, {
      x: left,
      y: height - 175,
      width: logoDims.width,
      height: logoDims.height,
    })
  } else {
    page.drawText("VVR", {
      x: left,
      y: height - 150,
      size: 42,
      font: fontBold,
      color: black,
    })
  }

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
    y: height - 198,
    size: 10,
    font: fontBold,
    color: black,
  })
  const eIdValue = sanitizePdfText(payload.e_id_number || "81886889")
  const eIdLabelWidth = fontBold.widthOfTextAtSize(eIdLabel, 10)
  page.drawText(eIdValue, {
    x: left + eIdLabelWidth + 10,
    y: height - 198,
    size: 10,
    font: fontRegular,
    color: black,
  })
  page.drawText(
    `PAYMENT MODE : ${sanitizePdfText(payload.payment_method || "CASH").toUpperCase()}`,
    {
      x: left,
      y: height - 214,
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
  let billedY = height - 265
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

  // Amounts table: service | description | amount — rounded professional card
  const serviceLabel = sanitizePdfText(payload.service_label || "THE STORE")
  const serviceFrom = sanitizePdfText(payload.service_from || "FROM eSERVICES")
  const tableX = left
  const tableWidth = right - left
  const cornerR = 10
  const col1X = tableX + 14
  const col2X = tableX + 132
  const col3Right = right - 14
  const colDivider1 = tableX + 122
  const colDivider2 = right - 102
  const headerH = 28
  const rowH = 30
  const summaryH = 26
  const totalH = 34
  const stampReserve = 190
  const tableMinY = stampReserve + 24
  const borderColor = rgb(0.72, 0.76, 0.8)
  const softRule = rgb(0.86, 0.88, 0.9)
  const headerFill = rgb(0.93, 0.96, 0.98)
  const summaryFill = rgb(0.97, 0.98, 0.99)
  const totalFill = rgb(0.9, 0.95, 0.98)
  const muted = rgb(0.35, 0.4, 0.45)
  const shadow = rgb(0.9, 0.92, 0.94)
  const white = rgb(1, 1, 1)

  /** SVG rounded-rect path (y down). Corners can be selectively rounded. */
  function roundedRectPath(
    w: number,
    h: number,
    r: number,
    corners: { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean } = {
      tl: true,
      tr: true,
      br: true,
      bl: true,
    }
  ) {
    const tl = corners.tl ? r : 0
    const tr = corners.tr ? r : 0
    const br = corners.br ? r : 0
    const bl = corners.bl ? r : 0
    return [
      `M ${tl} 0`,
      `H ${w - tr}`,
      tr ? `Q ${w} 0 ${w} ${tr}` : `H ${w}`,
      `V ${h - br}`,
      br ? `Q ${w} ${h} ${w - br} ${h}` : `V ${h}`,
      `H ${bl}`,
      bl ? `Q 0 ${h} 0 ${h - bl}` : `H 0`,
      `V ${tl}`,
      tl ? `Q 0 0 ${tl} 0` : `V 0`,
      "Z",
    ].join(" ")
  }

  function drawRoundedRect(
    x: number,
    topY: number,
    w: number,
    h: number,
    r: number,
    options: {
      fill?: ReturnType<typeof rgb>
      border?: ReturnType<typeof rgb>
      borderWidth?: number
      corners?: { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean }
    } = {}
  ) {
    const drawOptions: {
      x: number
      y: number
      color?: ReturnType<typeof rgb>
      borderColor?: ReturnType<typeof rgb>
      borderWidth: number
    } = {
      x,
      y: topY,
      borderWidth: options.borderWidth ?? 0,
    }
    if (options.fill) drawOptions.color = options.fill
    if (options.border) drawOptions.borderColor = options.border
    page.drawSvgPath(roundedRectPath(w, h, r, options.corners), drawOptions)
  }

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

  type TableRow =
    | { kind: "item"; description: string; amount: number; showSource: boolean }
    | { kind: "summary"; label: string; amount: number; boldAmount: boolean }
    | { kind: "total"; label: string; amount: number }

  const tableRows: TableRow[] = [
    ...items.map((item, index) => ({
      kind: "item" as const,
      description: item.description,
      amount: item.amount,
      showSource: index === 0,
    })),
    { kind: "summary", label: "SUBTOTAL", amount: subtotal, boldAmount: true },
    { kind: "summary", label: "e.SERVICE CHARGES", amount: serviceCharges, boldAmount: false },
    {
      kind: "summary",
      label: `IGST CHARGED AT ${Number(igstRate.toFixed(2))}%`,
      amount: igstAmount,
      boldAmount: false,
    },
    { kind: "total", label: "TOTAL eBILL", amount: total },
  ]

  function rowHeight(row: TableRow) {
    if (row.kind === "item") return row.showSource ? rowH + 10 : rowH
    if (row.kind === "total") return totalH
    return summaryH
  }

  function drawTableShell(topY: number, bottomY: number) {
    const h = topY - bottomY
    // Soft drop shadow
    drawRoundedRect(tableX + 2.5, topY - 2.5, tableWidth, h, cornerR, {
      fill: shadow,
    })
    // Card body
    drawRoundedRect(tableX, topY, tableWidth, h, cornerR, {
      fill: white,
      border: borderColor,
      borderWidth: 1.35,
    })
  }

  function drawTableHeader(topY: number) {
    const bottomY = topY - headerH
    drawRoundedRect(tableX, topY, tableWidth, headerH, cornerR, {
      fill: headerFill,
      corners: { tl: true, tr: true, br: false, bl: false },
    })
    // Accent underline under header
    page.drawLine({
      start: { x: tableX + 1, y: bottomY },
      end: { x: right - 1, y: bottomY },
      thickness: 1.4,
      color: taxBlue,
    })
    page.drawText("SERVICE", {
      x: col1X,
      y: bottomY + 10,
      size: 8.5,
      font: fontBold,
      color: muted,
    })
    page.drawText("DESCRIPTION", {
      x: col2X,
      y: bottomY + 10,
      size: 8.5,
      font: fontBold,
      color: muted,
    })
    drawRightAlignedText(page, "AMOUNT", {
      right: col3Right,
      y: bottomY + 10,
      size: 8.5,
      font: fontBold,
      color: muted,
    })
    return bottomY
  }

  function drawColumnDividers(topY: number, bottomY: number) {
    const insetTop = topY - 4
    const insetBottom = bottomY + 4
    page.drawLine({
      start: { x: colDivider1, y: insetBottom },
      end: { x: colDivider1, y: insetTop },
      thickness: 0.6,
      color: softRule,
    })
    page.drawLine({
      start: { x: colDivider2, y: insetBottom },
      end: { x: colDivider2, y: insetTop },
      thickness: 0.6,
      color: softRule,
    })
  }

  let lineY = Math.min(billedY - 40, height - 400)
  let rowIndex = 0

  while (rowIndex < tableRows.length) {
    const pageTop = lineY
    const headerBottom = pageTop - headerH
    let cursorY = headerBottom

    // Measure how many rows fit on this page
    let fitted = 0
    let probeY = cursorY
    for (let i = rowIndex; i < tableRows.length; i++) {
      const h = rowHeight(tableRows[i])
      if (probeY - h < tableMinY) break
      probeY -= h
      fitted++
    }
    if (fitted === 0) {
      page = pdfDoc.addPage([595, 842])
      lineY = height - 72
      page.drawText("TAX INVOICE (continued)", {
        x: left,
        y: lineY,
        size: 11,
        font: fontBold,
        color: taxBlue,
      })
      lineY -= 28
      continue
    }

    const slice = tableRows.slice(rowIndex, rowIndex + fitted)
    const bodyBottom = cursorY - slice.reduce((sum, row) => sum + rowHeight(row), 0)

    drawTableShell(pageTop, bodyBottom)
    drawTableHeader(pageTop)
    cursorY = headerBottom

    for (let i = 0; i < slice.length; i++) {
      const row = slice[i]
      const h = rowHeight(row)
      const rowBottom = cursorY - h
      const textY = rowBottom + (h - 10) / 2
      const isLast = i === slice.length - 1

      if (row.kind === "item") {
        if (row.showSource) {
          page.drawText(serviceLabel, {
            x: col1X,
            y: textY + 6,
            size: 9,
            font: fontBold,
            color: black,
          })
          page.drawText(serviceFrom, {
            x: col1X,
            y: textY - 6,
            size: 7,
            font: fontRegular,
            color: muted,
          })
        }
        page.drawText(fitDescription(row.description, colDivider2 - col2X - 10), {
          x: col2X,
          y: textY,
          size: 9,
          font: fontRegular,
          color: black,
        })
        drawRightAlignedText(page, formatAmount(row.amount), {
          right: col3Right,
          y: textY,
          size: 10,
          font: fontBold,
          color: black,
        })
      } else if (row.kind === "summary") {
        page.drawRectangle({
          x: tableX + 1,
          y: rowBottom,
          width: tableWidth - 2,
          height: h,
          color: summaryFill,
        })
        page.drawText(row.label, {
          x: col2X,
          y: textY,
          size: 8.5,
          font: fontBold,
          color: muted,
        })
        drawRightAlignedText(page, formatAmount(row.amount), {
          right: col3Right,
          y: textY,
          size: 10,
          font: row.boldAmount ? fontBold : fontRegular,
          color: black,
        })
      } else {
        drawRoundedRect(tableX, cursorY, tableWidth, h, cornerR, {
          fill: totalFill,
          corners: { tl: false, tr: false, br: true, bl: true },
        })
        page.drawText(row.label, {
          x: col1X,
          y: textY,
          size: 11,
          font: fontBold,
          color: black,
        })
        drawRightAlignedText(page, formatAmount(row.amount), {
          right: col3Right,
          y: textY,
          size: 12.5,
          font: fontBold,
          color: black,
        })
      }

      // Soft inset row separators (skip after last / total)
      if (!isLast && row.kind !== "total") {
        page.drawLine({
          start: { x: tableX + 12, y: rowBottom },
          end: { x: right - 12, y: rowBottom },
          thickness: 0.55,
          color: softRule,
        })
      }

      cursorY = rowBottom
    }

    drawColumnDividers(headerBottom, bodyBottom + (slice[slice.length - 1]?.kind === "total" ? totalH : 0))
    // Crisp rounded border on top of fills
    drawRoundedRect(tableX, pageTop, tableWidth, pageTop - bodyBottom, cornerR, {
      border: borderColor,
      borderWidth: 1.35,
    })

    rowIndex += fitted
    if (rowIndex < tableRows.length) {
      page = pdfDoc.addPage([595, 842])
      lineY = height - 72
      page.drawText("TAX INVOICE (continued)", {
        x: left,
        y: lineY,
        size: 11,
        font: fontBold,
        color: taxBlue,
      })
      lineY -= 28
    } else {
      lineY = bodyBottom - 14
    }
  }
  // Founder stamp + signature at bottom right of the last page
  const stampImage = await embedPngFromPublic(pdfDoc, "stamp.png")
  const signatureImage = await embedSignatureFromPublic(pdfDoc)

  const stampAreaX = right - 175
  const stampAreaY = 108

  if (stampImage) {
    const stampDims = fitImage(stampImage, 150, 95)
    page.drawImage(stampImage, {
      x: stampAreaX,
      y: stampAreaY,
      width: stampDims.width,
      height: stampDims.height,
      rotate: degrees(-3),
    })
  }

  if (signatureImage) {
    const signatureDims = fitImage(signatureImage, 220, 95)
    // Large, solid-black signature over the stamp
    page.drawImage(signatureImage, {
      x: stampAreaX - 5,
      y: stampAreaY + 8,
      width: signatureDims.width,
      height: signatureDims.height,
      rotate: degrees(8),
    })
  }

  page.drawText("Authorised Signatory", {
    x: stampAreaX + 28,
    y: 94,
    size: 8,
    font: fontRegular,
    color: black,
  })

  // Standard invoice footer — company address, GSTIN & contact
  const footerMuted = rgb(0.3, 0.3, 0.3)
  const companyPhone = process.env.INVOICE_COMPANY_PHONE || "+91 82891 252"
  const companyEmail = process.env.INVOICE_COMPANY_EMAIL || "info@vvrindustries.com"
  const companyAddress =
    process.env.INVOICE_COMPANY_ADDRESS || "RAVULAPALEM, AP 533238 . IND"
  const companyGstin = process.env.INVOICE_COMPANY_GSTIN || "37AALCV8324L1Z"

  page.drawText(`Thank you for choosing ${sanitizePdfText(FROM_COMPANY.replace(/\.$/, ""))}.`, {
    x: left,
    y: 58,
    size: 8,
    font: fontRegular,
    color: footerMuted,
  })
  page.drawText(`Address: ${sanitizePdfText(companyAddress)}`, {
    x: left,
    y: 46,
    size: 8,
    font: fontRegular,
    color: footerMuted,
  })
  page.drawText(`GSTIN REGISTRATION NUMBER - ${sanitizePdfText(companyGstin)}`, {
    x: left,
    y: 34,
    size: 8,
    font: fontBold,
    color: footerMuted,
  })
  page.drawText(`For any enquiries: ${companyEmail} | ${companyPhone}`, {
    x: left,
    y: 22,
    size: 8,
    font: fontRegular,
    color: footerMuted,
  })
  page.drawText("COPYRIGHT C 2026 V V R INDUSTRIES PVT. LTD.  |  All rights reserved", {
    x: left,
    y: 10,
    size: 7,
    font: fontRegular,
    color: footerMuted,
  })

  const invoiceNumber = payload.order_id || payload.e_id_number || formatInvoiceDate(payload.invoice_date)
  pdfDoc.setTitle(`Tax Invoice - ${payload.billed_to.name} - ${payload.invoice_date}`)

  const pdfBytes = await pdfDoc.save()
  return { pdfBytes, invoiceNumber }
}
