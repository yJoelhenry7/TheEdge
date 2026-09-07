"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import type { InvoiceItemInput } from "@/lib/invoice-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ItemState = {
  description: string
  amount: string
}

function normalizeInitialItems(items: InvoiceItemInput[]): ItemState[] {
  const mapped = items.map((item) => ({
    description: item.description,
    amount: item.amount,
  }))
  if (mapped.length > 0) return mapped
  return [{ description: "", amount: "" }]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function InvoiceItemsFields({
  initialItems = [],
}: {
  initialItems?: InvoiceItemInput[]
}) {
  const [items, setItems] = useState<ItemState[]>(normalizeInitialItems(initialItems))

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const amount = Number(item.amount)
        return sum + (Number.isNaN(amount) || amount < 0 ? 0 : amount)
      }, 0),
    [items]
  )

  function updateItem(index: number, field: keyof ItemState, value: string) {
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", amount: "" }])
  }

  function removeItem(index: number) {
    setItems((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Services</p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-black/15 px-3 py-1 text-xs font-medium text-foreground"
        >
          <Plus className="size-3.5 shrink-0" aria-hidden />
          Add service
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`item-row-${index}`} className="grid gap-2 md:grid-cols-[1fr_140px_auto]">
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Description <span className="text-destructive">*</span>
              </Label>
              <Input
                name="item_description"
                value={item.description}
                onChange={(event) => updateItem(index, "description", event.target.value)}
                placeholder="e.g. DRONE AD SHOOT AND PHOTOGRAPHY"
                required
              />
            </label>
            <label className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                name="item_amount"
                type="number"
                min="0"
                step="1"
                value={item.amount}
                onChange={(event) => updateItem(index, "amount", event.target.value)}
                placeholder="6000"
                required
              />
            </label>
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
        <span className="font-medium">Subtotal: </span>
        {formatCurrency(total)}
      </div>
    </div>
  )
}
