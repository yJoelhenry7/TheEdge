export type InvoiceItemInput = {
  description: string
  amount: string
}

export type InvoicePdfPayload = {
  invoice_date: string
  order_id: string
  e_id_number: string
  payment_method: string
  service_label: string
  service_from: string
  e_service_charges: string
  igst_rate: string
  charge_igst: boolean
  billed_to: {
    gstin: string
    name: string
    address: string
    country: string
  }
  items: InvoiceItemInput[]
}
