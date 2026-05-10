import type { Metadata } from "next"

import { ConnectPlatformForm } from "@/components/connect-platform-form"

export const metadata: Metadata = {
  title: "Connect your platform with eConnect",
}

export default function ConnectYourPlatformPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
        Business
      </p>
      <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground">
        Connect your platform with eConnect?
      </h1>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
        Choose whether you are bringing a platform to the network (seller) or
        connecting as a buyer. We will tailor the next steps to your role.
      </p>

      <div className="mt-12">
        <ConnectPlatformForm />
      </div>

      <ol className="mt-16 list-inside list-decimal space-y-3 border-t border-black/10 pt-12 text-sm text-muted-foreground">
        <li>We review your submission and clarify technical fit.</li>
        <li>Joint scope for a first integration or procurement path.</li>
        <li>Sandbox, milestones, and commercial alignment.</li>
      </ol>
    </div>
  )
}
