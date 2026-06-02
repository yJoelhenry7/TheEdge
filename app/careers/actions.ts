"use server"

import { parseCareersPayload } from "@/lib/careers-application"
import { sendCareersApplicationEmail, type CareersTrack } from "@/lib/mail"

export type CareersSubmitResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitCareersApplicationAction(
  track: CareersTrack,
  fields: Record<string, string>
): Promise<CareersSubmitResult> {
  const parsed = parseCareersPayload({ track, fields })

  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  try {
    await sendCareersApplicationEmail({
      track: parsed.track,
      fields: parsed.fields,
    })
    return { ok: true }
  } catch (error) {
    console.error("[careers]", error)

    const message =
      error instanceof Error ? error.message : "Failed to send application"

    const isConfig = message.includes("SMTP") || message.includes("recipient")

    return {
      ok: false,
      error: isConfig
        ? "Email is not configured on the server. Please try again later or email talent@vvrindustries.com directly."
        : "We could not send your application. Please try again or email talent@vvrindustries.com.",
    }
  }
}
