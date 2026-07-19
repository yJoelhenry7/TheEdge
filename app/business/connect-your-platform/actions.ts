"use server"

import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

import {
  buildEConnectEnquiryEmail,
  type EConnectParty,
} from "@/lib/econnect-email-template"

function getTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local"
    )
  }

  const port = Number(process.env.SMTP_PORT ?? "587")
  const secure =
    process.env.SMTP_SECURE === "true" || String(port) === "465"

  const config: SMTPTransport.Options = {
    host,
    port,
    secure,
    auth: { user, pass },
  }

  return nodemailer.createTransport(config)
}

export type EConnectSubmitResult =
  | { ok: true }
  | { ok: false; error: string }

const SELLER_FIELD_LABELS: Record<string, string> = {
  platformName: "Platform or product name",
  contactName: "Contact name",
  email: "Work email",
  phone: "Phone",
  primaryOffering: "What you offer",
  apiSurface: "APIs & integration points",
  notes: "Additional notes",
}

const BUYER_FIELD_LABELS: Record<string, string> = {
  organizationName: "Organisation name",
  contactName: "Contact name",
  email: "Work email",
  phone: "Phone",
  useCase: "What you are looking to connect or procure",
  regions: "Regions or markets",
  volumeOrScale: "Expected scale",
  notes: "Additional notes",
}

function labelFields(
  raw: Record<string, string>,
  labelMap: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value.trim()) {
      result[labelMap[key] ?? key] = value.trim()
    }
  }
  return result
}

export async function submitEConnectEnquiryAction(
  party: EConnectParty,
  rawFields: Record<string, string>
): Promise<EConnectSubmitResult> {
  if (party !== "seller" && party !== "buyer") {
    return { ok: false, error: "Invalid enquiry type." }
  }

  const labelMap = party === "seller" ? SELLER_FIELD_LABELS : BUYER_FIELD_LABELS
  const fields = labelFields(rawFields, labelMap)

  const email = rawFields.email?.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid work email address is required." }
  }

  const to = process.env.ECONNECT_TO_EMAIL ?? process.env.CAREERS_TO_EMAIL ?? process.env.SMTP_USER
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@vvrindustries.com"

  if (!to) {
    return {
      ok: false,
      error: "Email is not configured on the server. Please try again later or contact us directly.",
    }
  }

  try {
    const { subject, html, text } = buildEConnectEnquiryEmail({
      party,
      fields,
      submittedAt: new Date(),
    })

    const transporter = getTransporter()

    await transporter.sendMail({
      from: `"VVR eConnect" <${from}>`,
      to,
      replyTo: email,
      subject,
      text,
      html,
    })

    return { ok: true }
  } catch (error) {
    console.error("[econnect]", error)

    const message = error instanceof Error ? error.message : ""
    const isConfig = message.includes("SMTP") || message.includes("configured")

    return {
      ok: false,
      error: isConfig
        ? "Email is not configured on the server. Please try again later."
        : "We could not send your enquiry. Please try again or contact us directly.",
    }
  }
}
