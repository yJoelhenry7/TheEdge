"use client"

import * as React from "react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Party = "seller" | "buyer"

export function ConnectPlatformForm() {
  const [party, setParty] = React.useState<Party>("seller")
  const [submitted, setSubmitted] = React.useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="border border-black/15 bg-white px-8 py-12 text-center">
        <p className="font-serif text-xl font-medium tracking-tight text-foreground">
          Thank you
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We have received your details. A member of the eConnect team will
          follow up shortly.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-8 border-foreground"
          onClick={() => setSubmitted(false)}
        >
          Submit another
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <FieldSet>
        <FieldLegend variant="label" className="mb-4">
          I am a
        </FieldLegend>
        <RadioGroup
          value={party}
          onValueChange={(v) => setParty(v as Party)}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4"
        >
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 border border-black/15 p-5 transition-colors",
              party === "seller" && "border-foreground bg-muted/40"
            )}
          >
            <RadioGroupItem value="seller" id="party-seller" className="mt-0.5" />
            <span className="text-left">
              <span className="block text-sm font-medium text-foreground">
                Seller
              </span>
              <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">
                You offer a platform or product and want to integrate with
                eConnect.
              </span>
            </span>
          </label>
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 border border-black/15 p-5 transition-colors",
              party === "buyer" && "border-foreground bg-muted/40"
            )}
          >
            <RadioGroupItem value="buyer" id="party-buyer" className="mt-0.5" />
            <span className="text-left">
              <span className="block text-sm font-medium text-foreground">
                Buyer
              </span>
              <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">
                You want to connect to providers or marketplaces through
                eConnect.
              </span>
            </span>
          </label>
        </RadioGroup>
      </FieldSet>

      {party === "seller" ? (
        <SellerForm onSubmit={handleSubmit} />
      ) : (
        <BuyerForm onSubmit={handleSubmit} />
      )}
    </div>
  )
}

function SellerForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 border border-black/15 p-6 sm:p-8">
      <div>
        <h2 className="font-serif text-lg font-medium text-foreground">
          Seller details
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your platform so we can scope integration and
          onboarding.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="seller-platform">Platform or product name</FieldLabel>
          <FieldContent>
            <Input id="seller-platform" name="platformName" required autoComplete="organization" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="seller-contact">Primary contact name</FieldLabel>
          <FieldContent>
            <Input id="seller-contact" name="contactName" required autoComplete="name" />
          </FieldContent>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="seller-email">Work email</FieldLabel>
            <FieldContent>
              <Input
                id="seller-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="seller-phone">Phone</FieldLabel>
            <FieldContent>
              <Input
                id="seller-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="seller-offering">What you offer</FieldLabel>
          <FieldDescription>
            Category or short description of your product or API surface.
          </FieldDescription>
          <FieldContent>
            <Input id="seller-offering" name="primaryOffering" required />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="seller-api">APIs, webhooks, or integration points</FieldLabel>
          <FieldDescription>
            Outline what exists today (REST, events, SFTP, etc.).
          </FieldDescription>
          <FieldContent>
            <Textarea id="seller-api" name="apiSurface" rows={4} className="min-h-[100px]" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="seller-notes">Anything else we should know</FieldLabel>
          <FieldContent>
            <Textarea id="seller-notes" name="notes" rows={3} className="min-h-[80px]" />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full sm:w-auto">
        Submit seller enquiry
      </Button>
    </form>
  )
}

function BuyerForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 border border-black/15 p-6 sm:p-8">
      <div>
        <h2 className="font-serif text-lg font-medium text-foreground">
          Buyer details
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Help us understand what you need to buy or connect to through
          eConnect.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="buyer-org">Organisation name</FieldLabel>
          <FieldContent>
            <Input id="buyer-org" name="organizationName" required autoComplete="organization" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="buyer-contact">Primary contact name</FieldLabel>
          <FieldContent>
            <Input id="buyer-contact" name="contactName" required autoComplete="name" />
          </FieldContent>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="buyer-email">Work email</FieldLabel>
            <FieldContent>
              <Input
                id="buyer-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="buyer-phone">Phone</FieldLabel>
            <FieldContent>
              <Input
                id="buyer-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="buyer-use-case">What you are looking to connect or procure</FieldLabel>
          <FieldDescription>
            Suppliers, catalogues, checkout flows, regions, or other requirements.
          </FieldDescription>
          <FieldContent>
            <Textarea
              id="buyer-use-case"
              name="useCase"
              required
              rows={4}
              className="min-h-[100px]"
            />
          </FieldContent>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="buyer-regions">Regions or markets</FieldLabel>
            <FieldContent>
              <Input id="buyer-regions" name="regions" placeholder="e.g. UK, EU" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="buyer-scale">Expected scale</FieldLabel>
            <FieldContent>
              <Input
                id="buyer-scale"
                name="volumeOrScale"
                placeholder="Orders, volume, or timeline"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="buyer-notes">Anything else we should know</FieldLabel>
          <FieldContent>
            <Textarea id="buyer-notes" name="notes" rows={3} className="min-h-[80px]" />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full sm:w-auto">
        Submit buyer enquiry
      </Button>
    </form>
  )
}
