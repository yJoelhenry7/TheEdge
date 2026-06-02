"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CareersTrack } from "@/lib/mail"
import { cn } from "@/lib/utils"

type Track = CareersTrack | null

const optionClass = cn(
  "flex w-full flex-col border border-black/15 bg-white px-6 py-6 text-left transition-colors",
  "hover:border-foreground hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
)

function formDataToFields(form: HTMLFormElement) {
  const data = new FormData(form)
  const fields: Record<string, string> = {}

  for (const [key, value] of data.entries()) {
    if (typeof value === "string") {
      fields[key] = value
    }
  }

  return fields
}

async function submitCareersApplication(
  track: CareersTrack,
  fields: Record<string, string>
) {
  const response = await fetch("/api/careers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ track, fields }),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string
  }

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not submit your application.")
  }
}

type ApplicationFormProps = {
  track: CareersTrack
  onDone: () => void
  children: React.ReactNode
}

function ApplicationForm({ track, onDone, children }: ApplicationFormProps) {
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const fields = formDataToFields(e.currentTarget)
      await submitCareersApplication(track, fields)
      onDone()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit your application. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={submitting}
        className="w-full rounded-none sm:w-auto"
      >
        {submitting ? "Sending…" : "Submit application"}
      </Button>
    </form>
  )
}

export function CareersApplicationForms() {
  const [open, setOpen] = React.useState<Track>(null)
  const [thanks, setThanks] = React.useState<Track>(null)

  function close() {
    setOpen(null)
    setThanks(null)
  }

  return (
    <div className="mt-12 space-y-6">
      <p className="type-rolex-overline text-muted-foreground">Apply</p>
      <ul className="grid gap-4 sm:grid-cols-3">
        <li>
          <button
            type="button"
            className={optionClass}
            onClick={() => {
              setThanks(null)
              setOpen("freelancer")
            }}
          >
            <span className="font-sans text-lg font-medium tracking-tight text-foreground">
              Freelancers
            </span>
            <span className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              Project-based collaboration and specialist engagements.
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={optionClass}
            onClick={() => {
              setThanks(null)
              setOpen("volunteer")
            }}
          >
            <span className="font-sans text-lg font-medium tracking-tight text-foreground">
              Volunteers
            </span>
            <span className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              Contribute time and skills to initiatives that align with VVR.
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={optionClass}
            onClick={() => {
              setThanks(null)
              setOpen("employment")
            }}
          >
            <span className="font-sans text-lg font-medium tracking-tight text-foreground">
              Full-time employment
            </span>
            <span className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              Permanent roles across consulting, platforms, and operations.
            </span>
          </button>
        </li>
      </ul>

      <Dialog
        open={open === "freelancer"}
        onOpenChange={(next) => {
          if (!next) close()
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg" showCloseButton>
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-sans text-xl tracking-tight">
                Freelancer application
              </DialogTitle>
              <DialogDescription>
                Tell us how you work and what you deliver. We will reply by email.
              </DialogDescription>
            </DialogHeader>
            {thanks === "freelancer" ? (
              <ThanksBlurb onReset={close} />
            ) : (
              <FreelancerForm onDone={() => setThanks("freelancer")} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "volunteer"}
        onOpenChange={(next) => {
          if (!next) close()
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg" showCloseButton>
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-sans text-xl tracking-tight">
                Volunteer application
              </DialogTitle>
              <DialogDescription>
                Share your availability and how you would like to contribute.
              </DialogDescription>
            </DialogHeader>
            {thanks === "volunteer" ? (
              <ThanksBlurb onReset={close} />
            ) : (
              <VolunteerForm onDone={() => setThanks("volunteer")} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "employment"}
        onOpenChange={(next) => {
          if (!next) close()
        }}
      >
        <DialogContent className="max-h-[min(90vh,800px)] max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg" showCloseButton>
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-sans text-xl tracking-tight">
                Full-time employment
              </DialogTitle>
              <DialogDescription>
                Submit your profile for open or future full-time opportunities.
              </DialogDescription>
            </DialogHeader>
            {thanks === "employment" ? (
              <ThanksBlurb onReset={close} />
            ) : (
              <EmploymentForm onDone={() => setThanks("employment")} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ThanksBlurb({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 border border-black/10 bg-muted/30 px-6 py-8 text-center">
      <p className="font-sans text-lg font-medium text-foreground">Thank you</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your application has been sent to our talent team. We may contact you at
        the email address you provided.
      </p>
      <Button type="button" variant="outline" className="mt-8 border-foreground" onClick={onReset}>
        Close
      </Button>
    </div>
  )
}

function FreelancerForm({ onDone }: { onDone: () => void }) {
  return (
    <ApplicationForm track="freelancer" onDone={onDone}>
      <FieldSet>
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="fl-name">Full name</FieldLabel>
            <FieldContent>
              <Input id="fl-name" name="name" required autoComplete="name" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-email">Email</FieldLabel>
            <FieldContent>
              <Input id="fl-email" name="email" type="email" required autoComplete="email" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-phone">Phone</FieldLabel>
            <FieldContent>
              <Input id="fl-phone" name="phone" type="tel" autoComplete="tel" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-portfolio">Portfolio or website</FieldLabel>
            <FieldContent>
              <Input id="fl-portfolio" name="portfolio" type="url" placeholder="https://" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-skills">Services &amp; skills</FieldLabel>
            <FieldContent>
              <Textarea id="fl-skills" name="skills" rows={4} required placeholder="What you offer, tools, domains." />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-experience">Years of professional experience</FieldLabel>
            <FieldContent>
              <Input id="fl-experience" name="experience" required placeholder="e.g. 8" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-availability">Availability</FieldLabel>
            <FieldContent>
              <Textarea id="fl-availability" name="availability" rows={3} required placeholder="Days per week, time zones, notice period." />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="fl-rate">Rate expectations (optional)</FieldLabel>
            <FieldContent>
              <Textarea id="fl-rate" name="rate" rows={2} placeholder="Day rate, retainer, or project range." />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </ApplicationForm>
  )
}

function VolunteerForm({ onDone }: { onDone: () => void }) {
  return (
    <ApplicationForm track="volunteer" onDone={onDone}>
      <FieldSet>
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="vo-name">Full name</FieldLabel>
            <FieldContent>
              <Input id="vo-name" name="name" required autoComplete="name" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-email">Email</FieldLabel>
            <FieldContent>
              <Input id="vo-email" name="email" type="email" required autoComplete="email" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-phone">Phone</FieldLabel>
            <FieldContent>
              <Input id="vo-phone" name="phone" type="tel" autoComplete="tel" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-focus">Area of interest</FieldLabel>
            <FieldContent>
              <Textarea id="vo-focus" name="focus" rows={3} required placeholder="Causes, programmes, or teams you want to support." />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-hours">Weekly availability</FieldLabel>
            <FieldContent>
              <Input id="vo-hours" name="hours" required placeholder="e.g. 4 hours / week" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-experience">Relevant experience</FieldLabel>
            <FieldContent>
              <Textarea id="vo-experience" name="experience" rows={4} required placeholder="Background, skills, prior volunteering." />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="vo-motivation">Motivation</FieldLabel>
            <FieldContent>
              <Textarea id="vo-motivation" name="motivation" rows={3} required placeholder="Why VVR, what you hope to contribute." />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </ApplicationForm>
  )
}

function EmploymentForm({ onDone }: { onDone: () => void }) {
  return (
    <ApplicationForm track="employment" onDone={onDone}>
      <FieldSet>
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="em-name">Full name</FieldLabel>
            <FieldContent>
              <Input id="em-name" name="name" required autoComplete="name" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-email">Email</FieldLabel>
            <FieldContent>
              <Input id="em-email" name="email" type="email" required autoComplete="email" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-phone">Phone</FieldLabel>
            <FieldContent>
              <Input id="em-phone" name="phone" type="tel" required autoComplete="tel" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-role">Role or department of interest</FieldLabel>
            <FieldContent>
              <Input id="em-role" name="role" required placeholder="e.g. Platform engineer, Consultant" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-linkedin">LinkedIn profile</FieldLabel>
            <FieldContent>
              <Input id="em-linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/…" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-cv">CV or resume link</FieldLabel>
            <FieldContent>
              <Input id="em-cv" name="cv" type="url" required placeholder="Link to PDF or portfolio" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-years">Years of relevant experience</FieldLabel>
            <FieldContent>
              <Input id="em-years" name="years" required placeholder="e.g. 5" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-notice">Notice period / availability</FieldLabel>
            <FieldContent>
              <Input id="em-notice" name="notice" required placeholder="e.g. 4 weeks, immediate" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="em-cover">Cover letter</FieldLabel>
            <FieldContent>
              <Textarea id="em-cover" name="cover" rows={5} required placeholder="Why VVR and what you bring to the team." />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </ApplicationForm>
  )
}
