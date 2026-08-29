"use client"

import * as React from "react"
import { Download, FileText } from "lucide-react"

import { InvoiceItemsFields } from "@/components/invoice-items-fields"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { parseInvoiceFormData } from "@/lib/invoice-form-utils"
import type { InvoicePdfPayload } from "@/lib/invoice-types"

function formDataToPayload(form: HTMLFormElement): InvoicePdfPayload | null {
  const parsed = parseInvoiceFormData(new FormData(form))
  return parsed.ok ? parsed.payload : null
}

export function InvoiceForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [generating, setGenerating] = React.useState(false)
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setGenerating(true)

    try {
      const payload = formDataToPayload(event.currentTarget)
      if (!payload) {
        setError("Please fill all required fields with valid values.")
        return
      }

      const response = await fetch("/api/invoice/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        const message =
          result && typeof result === "object" && "error" in result
            ? String(result.error)
            : "Failed to generate invoice PDF"
        throw new Error(message)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      const disposition = response.headers.get("Content-Disposition") ?? ""
      const nameMatch = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
      anchor.download = nameMatch?.[1] ?? `invoice-${payload.invoice_date}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Could not generate the invoice right now."
      setError(message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-black/15 bg-white p-6 sm:p-8">
      {error ? (
        <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Customer details</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="customer_name">
                Customer name <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input id="customer_name" name="customer_name" required placeholder="Full name or contact" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="customer_company">Company</FieldLabel>
              <FieldContent>
                <Input id="customer_company" name="customer_company" placeholder="Company name (optional)" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="customer_id">Customer ID</FieldLabel>
              <FieldContent>
                <Input id="customer_id" name="customer_id" placeholder="Optional reference ID" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="customer_email">Email</FieldLabel>
              <FieldContent>
                <Input id="customer_email" name="customer_email" type="email" placeholder="customer@example.com" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="customer_phone">Phone</FieldLabel>
              <FieldContent>
                <Input id="customer_phone" name="customer_phone" placeholder="+91 9876543210" />
              </FieldContent>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="customer_address">Address</FieldLabel>
              <FieldContent>
                <Textarea id="customer_address" name="customer_address" placeholder="Billing address" rows={2} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Invoice details</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="invoice_number">Invoice number</FieldLabel>
              <FieldContent>
                <Input id="invoice_number" name="invoice_number" placeholder="Auto-generated if left blank" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="invoice_date">
                Invoice date <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input id="invoice_date" name="invoice_date" type="date" required defaultValue={today} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <FieldContent>
                <select
                  id="status"
                  name="status"
                  defaultValue="unpaid"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="payment_method">Payment method</FieldLabel>
              <FieldContent>
                <select
                  id="payment_method"
                  name="payment_method"
                  defaultValue=""
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select payment method</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </FieldContent>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="upi_transaction_id">UPI transaction ID</FieldLabel>
              <FieldContent>
                <Input
                  id="upi_transaction_id"
                  name="upi_transaction_id"
                  placeholder="Required when payment method is UPI"
                />
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="sm:col-span-2">
              <input
                type="checkbox"
                name="include_treatment_date"
                id="include_treatment_date"
                defaultChecked
                className="size-4 rounded border-input"
              />
              <FieldContent>
                <FieldLabel htmlFor="include_treatment_date">Include date column in invoice PDF</FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        <InvoiceItemsFields />

        <Field>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <FieldContent>
            <Textarea id="notes" name="notes" placeholder="Internal notes (not shown on PDF)" rows={3} />
            <FieldDescription>Notes are kept for your reference and are not printed on the PDF.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={generating} className="mt-8 gap-2">
        {generating ? (
          <>
            <FileText className="size-4" aria-hidden />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="size-4" aria-hidden />
            Generate invoice PDF
          </>
        )}
      </Button>
    </form>
  )
}
