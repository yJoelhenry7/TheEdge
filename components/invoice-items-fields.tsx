"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import type { InvoiceItemInput } from "@/lib/invoice-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ItemState = {
  treatment_name: string
  treatment_date: string
  cost: string
  discount: string
}

function toState(item: InvoiceItemInput): ItemState {
  const cost = Number(item.cost)
  const offer = item.offer_amount.trim() === "" ? null : Number(item.offer_amount)
  let discount = ""
  if (offer !== null && !Number.isNaN(offer) && !Number.isNaN(cost) && cost > 0 && offer <= cost) {
    const percent = ((cost - offer) / cost) * 100
    if (percent > 0) discount = String(Number(percent.toFixed(2)))
  }
  return { treatment_name: item.treatment_name, treatment_date: item.treatment_date, cost: item.cost, discount }
}

function discountPercent(item: ItemState): number {
  const percent = item.discount.trim() === "" ? 0 : Number(item.discount)
  if (Number.isNaN(percent) || percent <= 0) return 0
  return Math.min(percent, 100)
}

function normalizeInitialItems(items: InvoiceItemInput[]): ItemState[] {
  const mapped = items.map(toState)
  if (mapped.length > 0) return mapped
  return [{ treatment_name: "", treatment_date: "", cost: "", discount: "" }]
}

function netAmount(item: ItemState): number {
  const cost = Number(item.cost)
  if (Number.isNaN(cost) || cost < 0) return 0
  const percent = discountPercent(item)
  if (percent <= 0) return cost
  return Math.max(0, cost - (cost * percent) / 100)
}

function offerValue(item: ItemState): string {
  const cost = Number(item.cost)
  if (Number.isNaN(cost) || cost < 0) return ""
  const percent = discountPercent(item)
  if (percent <= 0) return ""
  return String(Number(Math.max(0, cost - (cost * percent) / 100).toFixed(2)))
}

function formatCurrency(value: number) {
  return `INR ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`
}

export function InvoiceItemsFields({
  initialItems = [],
  compact = false,
}: {
  initialItems?: InvoiceItemInput[]
  compact?: boolean
}) {
  const [items, setItems] = useState<ItemState[]>(normalizeInitialItems(initialItems))
  const rowClass = compact
    ? "grid gap-2 sm:grid-cols-2"
    : "grid gap-2 md:grid-cols-[1fr_140px_120px_120px_120px_auto]"

  const total = useMemo(() => items.reduce((sum, item) => sum + netAmount(item), 0), [items])

  function updateItem(index: number, field: keyof ItemState, value: string) {
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, { treatment_name: "", treatment_date: "", cost: "", discount: "" }])
  }

  function removeItem(index: number) {
    setItems((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Line items</p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-black/15 px-3 py-1 text-xs font-medium text-foreground"
        >
          <Plus className="size-3.5 shrink-0" aria-hidden />
          Add item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`item-row-${index}`}
            className={`${rowClass} ${compact ? "rounded-md border border-black/10 bg-white p-2" : ""}`}
          >
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <Input
                name="item_treatment_name"
                value={item.treatment_name}
                onChange={(event) => updateItem(index, "treatment_name", event.target.value)}
                placeholder="Item or service"
                required
              />
            </label>
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Date</Label>
              <Input
                name="item_date"
                type="date"
                value={item.treatment_date}
                onChange={(event) => updateItem(index, "treatment_date", event.target.value)}
              />
            </label>
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                name="item_cost"
                type="number"
                min="0"
                step="0.01"
                value={item.cost}
                onChange={(event) => updateItem(index, "cost", event.target.value)}
                placeholder="0.00"
                required
              />
            </label>
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={item.discount}
                onChange={(event) => updateItem(index, "discount", event.target.value)}
                placeholder="0"
              />
            </label>
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Payable</Label>
              <Input
                value={new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                  netAmount(item)
                )}
                readOnly
                tabIndex={-1}
                className="bg-muted text-muted-foreground"
              />
            </label>
            <input type="hidden" name="item_offer_amount" value={offerValue(item)} readOnly />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 self-end rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-3.5 shrink-0" aria-hidden />
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-black/10 bg-muted/40 px-3 py-2 text-sm">
        <span className="font-medium">Total payable: </span>
        {formatCurrency(total)}
        <span className="mt-1 block text-xs text-muted-foreground">
          Payable = Amount − (Amount × Discount%). Zero rupees is allowed.
        </span>
      </div>
    </div>
  )
}
