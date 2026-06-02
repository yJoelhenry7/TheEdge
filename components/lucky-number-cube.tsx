"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ROTATIONS = [
  "rotateX(-18deg) rotateY(24deg)",
  "rotateX(12deg) rotateY(-32deg)",
  "rotateX(-28deg) rotateY(48deg)",
  "rotateX(22deg) rotateY(-12deg)",
  "rotateX(-8deg) rotateY(62deg)",
  "rotateX(32deg) rotateY(-48deg)",
  "rotateX(-22deg) rotateY(16deg)",
  "rotateX(18deg) rotateY(-58deg)",
  "rotateX(-32deg) rotateY(36deg)",
]

type LuckyNumberCubeProps = {
  number: string
  className?: string
}

export function LuckyNumberCube({ number, className }: LuckyNumberCubeProps) {
  const active = number.length > 0
  const display = active ? number : "?"
  const [rollKey, setRollKey] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    setRollKey((key) => key + 1)
  }, [number, active])

  const index = active ? (Number.parseInt(number, 10) - 1) % ROTATIONS.length : 0
  const restRotation = ROTATIONS[index] ?? ROTATIONS[0]

  return (
    <div
      className={cn(
        "lucky-cube-scene flex flex-col items-center gap-6",
        active && "lucky-cube-scene--active",
        className
      )}
      aria-hidden={!active}
    >
      <p className="text-center font-sans text-[0.625rem] font-normal uppercase tracking-[0.28em] text-muted-foreground">
        {active ? "Your roll" : "Pick a number"}
      </p>
      <div
        key={rollKey}
        className={cn("lucky-cube", active && "lucky-cube--rolling")}
        style={
          active
            ? ({ ["--lucky-cube-rest" as string]: restRotation } as React.CSSProperties)
            : undefined
        }
      >
        {(
          [
            "front",
            "back",
            "right",
            "left",
            "top",
            "bottom",
          ] as const
        ).map((face) => (
          <div key={face} className={cn("lucky-cube__face", `lucky-cube__face--${face}`)}>
            <span>{display}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
