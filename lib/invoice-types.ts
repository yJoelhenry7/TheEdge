export type InvoiceItemInput = {
  treatment_name: string
  treatment_date: string
  cost: string
  offer_amount: string
}

export type InvoicePdfPayload = {
  invoice_number: string
  invoice_date: string
  status: "paid" | "unpaid" | "partial"
  payment_method: string
  upi_transaction_id: string
  include_treatment_date: boolean
  notes: string
  customer: {
    full_name: string
    company: string
    customer_id: string
    email: string
    phone: string
    address: string
  }
  items: InvoiceItemInput[]
}
