import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

import {
  buildApplicantConfirmationEmail,
  buildApplicationNotificationEmail,
} from "@/lib/careers-email-templates"

export type CareersTrack = "freelancer" | "volunteer" | "employment"

function getSmtpConfig(): SMTPTransport.Options {
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

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  }
}

function getTransporter() {
  return nodemailer.createTransport(getSmtpConfig())
}

export async function sendCareersApplicationEmail({
  track,
  fields,
}: {
  track: CareersTrack
  fields: Record<string, string>
}) {
  const to = process.env.CAREERS_TO_EMAIL ?? process.env.SMTP_USER
  const from =
    process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@vvrindustries.com"

  if (!to) {
    throw new Error(
      "No recipient configured. Set CAREERS_TO_EMAIL or SMTP_USER in .env.local"
    )
  }

  const applicantEmail = fields["Email"]?.trim()
  const applicantName = fields["Full name"]?.trim() ?? "Applicant"
  const submittedAt = new Date()

  const notification = buildApplicationNotificationEmail({
    track,
    fields,
    submittedAt,
  })

  const transporter = getTransporter()

  await transporter.sendMail({
    from: `"VVR Careers" <${from}>`,
    to,
    replyTo: applicantEmail || undefined,
    subject: notification.subject,
    text: notification.text,
    html: notification.html,
  })

  if (process.env.CAREERS_SEND_CONFIRMATION === "true" && applicantEmail) {
    const confirmation = buildApplicantConfirmationEmail({
      applicantName,
      track,
    })

    await transporter.sendMail({
      from: `"VVR Industries" <${from}>`,
      to: applicantEmail,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
    })
  }
}
