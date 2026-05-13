import { Fragment } from "react"

import { cn } from "@/lib/utils"

/** Standalone “KKRV” with consistent letter-spacing (headings, labels, captions). */
export function KkrvName({ className }: { className?: string }) {
  return (
    <span className={cn("tracking-[0.16em] text-inherit", className)}>KKRV</span>
  )
}

/** Running text: every “KKRV” token gets the same spacing treatment. */
export function KkrvSpacedText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = text.split("KKRV")
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span className={cn("tracking-[0.14em] text-inherit", className)}>
              KKRV
            </span>
          ) : null}
        </Fragment>
      ))}
    </>
  )
}
