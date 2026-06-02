import type { CareersTrack } from "@/lib/mail"

const FIELD_LABELS: Record<string, string> = {
  name: "Full name",
  email: "Email",
  phone: "Phone",
  portfolio: "Portfolio or website",
  skills: "Services & skills",
  experience: "Years of professional experience",
  availability: "Availability",
  rate: "Rate expectations",
  focus: "Area of interest",
  hours: "Weekly availability",
  motivation: "Motivation",
  role: "Role or department",
  linkedin: "LinkedIn",
  cv: "CV or resume link",
  years: "Years of relevant experience",
  notice: "Notice period / availability",
  cover: "Cover letter",
  luckyNumber: "Lucky number",
}

const REQUIRED_BY_TRACK: Record<CareersTrack, string[]> = {
  freelancer: [
    "name",
    "email",
    "skills",
    "experience",
    "availability",
  ],
  volunteer: [
    "name",
    "email",
    "focus",
    "hours",
    "experience",
    "motivation",
  ],
  employment: [
    "name",
    "email",
    "phone",
    "role",
    "cv",
    "years",
    "notice",
    "cover",
  ],
}

export function parseCareersPayload(body: unknown):
  | { ok: true; track: CareersTrack; fields: Record<string, string> }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" }
  }

  const { track, fields } = body as {
    track?: unknown
    fields?: unknown
  }

  if (
    track !== "freelancer" &&
    track !== "volunteer" &&
    track !== "employment"
  ) {
    return { ok: false, error: "Invalid application type" }
  }

  if (!fields || typeof fields !== "object") {
    return { ok: false, error: "Missing application fields" }
  }

  const raw = fields as Record<string, unknown>
  const normalized: Record<string, string> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value !== "string") continue
    const trimmed = value.trim()
    if (trimmed) {
      normalized[key] = trimmed
    }
  }

  for (const key of REQUIRED_BY_TRACK[track]) {
    if (!normalized[key]) {
      const label = FIELD_LABELS[key] ?? key
      return { ok: false, error: `Missing required field: ${label}` }
    }
  }

  const email = normalized.email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid email address is required" }
  }

  const labeled: Record<string, string> = {}
  for (const [key, value] of Object.entries(normalized)) {
    labeled[FIELD_LABELS[key] ?? key] = value
  }

  return { ok: true, track, fields: labeled }
}
