import { NextResponse } from "next/server"

import { parseCareersPayload } from "@/lib/careers-application"
import { sendCareersApplicationEmail } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseCareersPayload(body)

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    await sendCareersApplicationEmail({
      track: parsed.track,
      fields: parsed.fields,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[careers]", error)

    const message =
      error instanceof Error ? error.message : "Failed to send application"

    const isConfig = message.includes("SMTP") || message.includes("recipient")

    return NextResponse.json(
      {
        error: isConfig
          ? "Email is not configured on the server. Please try again later or email talent@vvrindustries.com directly."
          : "We could not send your application. Please try again or email talent@vvrindustries.com.",
      },
      { status: isConfig ? 503 : 500 }
    )
  }
}
