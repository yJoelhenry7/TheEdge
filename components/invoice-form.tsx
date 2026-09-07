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
        const parsed = parseInvoiceFormData(new FormData(event.currentTarget))
        setError(parsed.ok ? "Please fill all required fields with valid values." : parsed.error)
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
      anchor.download = nameMatch?.[1] ?? `e.Bill.pdf`
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
          <FieldLegend>Invoice</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="invoice_date">
                Invoice date <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input id="invoice_date" name="invoice_date" type="date" required defaultValue={today} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="order_id">Order ID</FieldLabel>
              <FieldContent>
                <Input id="order_id" name="order_id" placeholder="Optional" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="e_id_number">E ID number</FieldLabel>
              <FieldContent>
                <Input id="e_id_number" name="e_id_number" defaultValue="81886889" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="payment_method">Payment method</FieldLabel>
              <FieldContent>
                <select
                  id="payment_method"
                  name="payment_method"
                  defaultValue="CASH"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK TRANSFER">BANK TRANSFER</option>
                </select>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Billed to</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="billed_name">
                Name / company <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="billed_name"
                  name="billed_name"
                  required
                  placeholder="ISHI STEEL RESOURCES LLP"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="gstin">GSTIN</FieldLabel>
              <FieldContent>
                <Input id="gstin" name="gstin" placeholder="37AAJFI1477L1ZW" />
              </FieldContent>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="billed_address">Address</FieldLabel>
              <FieldContent>
                <Textarea
                  id="billed_address"
                  name="billed_address"
                  placeholder="KOTHAPETA, AP- 533223"
                  rows={2}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="billed_country">Country</FieldLabel>
              <FieldContent>
                <Input id="billed_country" name="billed_country" defaultValue="IND." />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Service source</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="service_label">Service label</FieldLabel>
              <FieldContent>
                <Input id="service_label" name="service_label" defaultValue="THE STORE" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="service_from">From line</FieldLabel>
              <FieldContent>
                <Input id="service_from" name="service_from" defaultValue="FROM eSERVICES" />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        <InvoiceItemsFields />

        <FieldSet>
          <FieldLegend>Charges & tax</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="e_service_charges">e.Service charges</FieldLabel>
              <FieldContent>
                <Input
                  id="e_service_charges"
                  name="e_service_charges"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="igst_rate">IGST rate (%)</FieldLabel>
              <FieldContent>
                <Input id="igst_rate" name="igst_rate" type="number" min="0" step="0.01" defaultValue="18" />
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="sm:col-span-2">
              <input
                type="checkbox"
                name="charge_igst"
                id="charge_igst"
                className="size-4 rounded border-input"
              />
              <FieldContent>
                <FieldLabel htmlFor="charge_igst">Charge IGST on this invoice</FieldLabel>
                <FieldDescription>
                  When unchecked, IGST shows as 0 (as in the sample). When checked, IGST is calculated on
                  subtotal + e.Service charges.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
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
            Generate tax invoice PDF
          </>
        )}
      </Button>
    </form>
  )
}
