import type { InvoiceItemInput, InvoicePdfPayload } from "@/lib/invoice-types"

function getAll(formData: FormData, key: string): string[] {
  return formData.getAll(key).map((value) => String(value))
}

export function parseInvoiceFormData(formData: FormData): { ok: true; payload: InvoicePdfPayload } | { ok: false; error: string } {
  const customerName = String(formData.get("customer_name") ?? "").trim()
  const invoiceDate = String(formData.get("invoice_date") ?? "").trim()

  if (!customerName) {
    return { ok: false, error: "Customer name is required." }
  }
  if (!invoiceDate) {
    return { ok: false, error: "Invoice date is required." }
  }

  const treatmentNames = getAll(formData, "item_treatment_name")
  const treatmentDates = getAll(formData, "item_date")
  const costs = getAll(formData, "item_cost")
  const offerAmounts = getAll(formData, "item_offer_amount")

  if (treatmentNames.length === 0) {
    return { ok: false, error: "Add at least one line item." }
  }

  const items: InvoiceItemInput[] = treatmentNames.map((name, index) => ({
    treatment_name: name.trim(),
    treatment_date: treatmentDates[index] ?? "",
    cost: costs[index] ?? "",
    offer_amount: offerAmounts[index] ?? "",
  }))

  const invalidItem = items.find((item) => !item.treatment_name || item.cost.trim() === "" || Number.isNaN(Number(item.cost)))
  if (invalidItem) {
    return { ok: false, error: "Each line item needs a description and valid amount." }
  }

  const paymentMethod = String(formData.get("payment_method") ?? "").trim()
  const upiTransactionId = String(formData.get("upi_transaction_id") ?? "").trim()
  if (paymentMethod === "upi" && !upiTransactionId) {
    return { ok: false, error: "UPI Transaction ID is required when payment method is UPI." }
  }

  const status = String(formData.get("status") ?? "unpaid")
  if (status !== "paid" && status !== "unpaid" && status !== "partial") {
    return { ok: false, error: "Invalid invoice status." }
  }

  return {
    ok: true,
    payload: {
      invoice_number: String(formData.get("invoice_number") ?? "").trim(),
      invoice_date: invoiceDate,
      status,
      payment_method: paymentMethod,
      upi_transaction_id: upiTransactionId,
      include_treatment_date: formData.get("include_treatment_date") === "on",
      notes: String(formData.get("notes") ?? "").trim(),
      customer: {
        full_name: customerName,
        company: String(formData.get("customer_company") ?? "").trim(),
        customer_id: String(formData.get("customer_id") ?? "").trim(),
        email: String(formData.get("customer_email") ?? "").trim(),
        phone: String(formData.get("customer_phone") ?? "").trim(),
        address: String(formData.get("customer_address") ?? "").trim(),
      },
      items,
    },
  }
}

export function parseInvoiceJson(body: unknown): { ok: true; payload: InvoicePdfPayload } | { ok: false; error: string } {
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
        data.append("item_treatment_name", String(row.treatment_name ?? ""))
        data.append("item_date", String(row.treatment_date ?? ""))
        data.append("item_cost", String(row.cost ?? ""))
        data.append("item_offer_amount", String(row.offer_amount ?? ""))
      }
      continue
    }

    if (key === "customer" && value && typeof value === "object") {
      const customer = value as Record<string, unknown>
      data.set("customer_name", String(customer.full_name ?? ""))
      data.set("customer_company", String(customer.company ?? ""))
      data.set("customer_id", String(customer.customer_id ?? ""))
      data.set("customer_email", String(customer.email ?? ""))
      data.set("customer_phone", String(customer.phone ?? ""))
      data.set("customer_address", String(customer.address ?? ""))
      continue
    }

    if (key === "include_treatment_date") {
      data.set("include_treatment_date", value ? "on" : "off")
      continue
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      data.set(key, String(value))
    }
  }

  return parseInvoiceFormData(data)
}
