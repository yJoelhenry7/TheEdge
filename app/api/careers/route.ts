import { NextResponse } from "next/server"

import { submitCareersApplicationAction } from "@/app/careers/actions"
import { parseCareersPayload } from "@/lib/careers-application"

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = parseCareersPayload(body)

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const result = await submitCareersApplicationAction(
    parsed.track,
    parsed.fields
  )

  if (!result.ok) {
    const isConfig = result.error.includes("not configured")
    return NextResponse.json(
      { error: result.error },
      { status: isConfig ? 503 : 500 }
    )
  }

  return NextResponse.json({ success: true })
}
