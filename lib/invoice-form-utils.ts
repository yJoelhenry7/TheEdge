import type { InvoiceItemInput, InvoicePdfPayload } from "@/lib/invoice-types"

function getAll(formData: FormData, key: string): string[] {
  return formData.getAll(key).map((value) => String(value))
}

export function parseInvoiceFormData(
  formData: FormData
): { ok: true; payload: InvoicePdfPayload } | { ok: false; error: string } {
  const billedName = String(formData.get("billed_name") ?? "").trim()
  const invoiceDate = String(formData.get("invoice_date") ?? "").trim()

  if (!billedName) {
    return { ok: false, error: "Billed-to name is required." }
  }
  if (!invoiceDate) {
    return { ok: false, error: "Invoice date is required." }
  }

  const descriptions = getAll(formData, "item_description")
  const amounts = getAll(formData, "item_amount")

  if (descriptions.length === 0) {
    return { ok: false, error: "Add at least one service line." }
  }

  const items: InvoiceItemInput[] = descriptions.map((description, index) => ({
    description: description.trim(),
    amount: amounts[index] ?? "",
  }))

  const invalidItem = items.find(
    (item) => !item.description || item.amount.trim() === "" || Number.isNaN(Number(item.amount))
  )
  if (invalidItem) {
    return { ok: false, error: "Each line needs a description and valid amount." }
  }

  const eServiceCharges = String(formData.get("e_service_charges") ?? "0").trim() || "0"
  if (Number.isNaN(Number(eServiceCharges))) {
    return { ok: false, error: "e.Service charges must be a valid number." }
  }

  const igstRate = String(formData.get("igst_rate") ?? "18").trim() || "18"
  if (Number.isNaN(Number(igstRate))) {
    return { ok: false, error: "IGST rate must be a valid number." }
  }

  return {
    ok: true,
    payload: {
      invoice_date: invoiceDate,
      order_id: String(formData.get("order_id") ?? "").trim(),
      e_id_number: String(formData.get("e_id_number") ?? "").trim() || "81886889",
      payment_method: String(formData.get("payment_method") ?? "").trim() || "CASH",
      service_label: String(formData.get("service_label") ?? "").trim() || "THE STORE",
      service_from: String(formData.get("service_from") ?? "").trim() || "FROM eSERVICES",
      e_service_charges: eServiceCharges,
      igst_rate: igstRate,
      charge_igst: formData.get("charge_igst") === "on",
      billed_to: {
        gstin: String(formData.get("gstin") ?? "").trim(),
        name: billedName,
        address: String(formData.get("billed_address") ?? "").trim(),
        country: String(formData.get("billed_country") ?? "").trim() || "IND.",
      },
      items,
    },
  }
}

export function parseInvoiceJson(
  body: unknown
): { ok: true; payload: InvoicePdfPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." }
  }

  const data = new FormData()
  const record = body as Record<string, unknown>

  for (const [key, value] of Object.entries(record)) {
    if (key === "items" && Array.isArray(value)) {
      for (const item of value) {
        if (!item || typeof item !== "object") continue
        const row = item as Record<string, unknown>
        data.append("item_description", String(row.description ?? ""))
        data.append("item_amount", String(row.amount ?? ""))
      }
      continue
    }

    if (key === "billed_to" && value && typeof value === "object") {
      const billed = value as Record<string, unknown>
      data.set("gstin", String(billed.gstin ?? ""))
      data.set("billed_name", String(billed.name ?? ""))
      data.set("billed_address", String(billed.address ?? ""))
      data.set("billed_country", String(billed.country ?? ""))
      continue
    }

    if (key === "charge_igst") {
      data.set("charge_igst", value ? "on" : "off")
      continue
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      data.set(key, String(value))
    }
  }

  return parseInvoiceFormData(data)
}
