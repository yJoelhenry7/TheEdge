"use client"

import * as React from "react"

type Star = {
  x: number
  y: number
  r: number
  a: number
  tw: number
  twSpeed: number
  vx: number
  vy: number
  layer: number
}

function createStars(count: number, w: number, h: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const layer = Math.random()
    const depth = layer < 0.35 ? 0.35 : layer < 0.7 ? 0.7 : 1.15
    const drift = 0.12 + depth * 0.55
    const angle = -0.35 + Math.random() * 0.25
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.2 + 0.25) * (0.7 + depth * 0.45),
      a: Math.random() * 0.5 + 0.3,
      tw: Math.random() * Math.PI * 2,
      twSpeed: Math.random() * 1.4 + 0.6,
      vx: Math.cos(angle) * drift,
      vy: Math.sin(angle) * drift * 0.55,
      layer: depth,
    })
  }
  return stars
}

export function LinksSpaceBg() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const starsRef = React.useRef<Star[]>([])
  const sizeRef = React.useRef({ w: 0, h: 0 })
  const rafRef = React.useRef(0)
  const reducedMotion = React.useRef(false)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const resize = (w: number, h: number) => {
      if (w < 1 || h < 1) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      sizeRef.current = { w, h }
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const density = Math.round((w * h) / 3800)
      starsRef.current = createStars(Math.min(Math.max(density, 160), 520), w, h)
    }

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      resize(width, height)
    })
    ro.observe(wrap)

    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2.5)
      last = now
      const { w, h } = sizeRef.current

      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h)

        for (const star of starsRef.current) {
          if (!reducedMotion.current) {
            star.x += star.vx * dt
            star.y += star.vy * dt
            star.tw += 0.02 * star.twSpeed * dt

            if (star.x < -4) star.x = w + 4
            if (star.x > w + 4) star.x = -4
            if (star.y < -4) star.y = h + 4
            if (star.y > h + 4) star.y = -4
          }

          const twinkle = reducedMotion.current
            ? 1
            : 0.5 + 0.5 * Math.sin(star.tw)
          const alpha = star.a * twinkle

          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
          ctx.fill()

          if (star.r > 1.05) {
            ctx.beginPath()
            ctx.fillStyle = `rgba(255,245,220,${alpha * 0.32})`
            ctx.arc(star.x, star.y, star.r * 2.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="links-space pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#03050c]" />

      <div className="links-space__nebula links-space__nebula--a absolute inset-0" />
      <div className="links-space__nebula links-space__nebula--b absolute inset-0" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 96% 4%, rgba(255,232,140,0.16) 0%, rgba(255,200,90,0.06) 38%, transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 32% 28% at 97% 2%, rgba(255,248,210,0.22) 0%, rgba(255,220,120,0.08) 48%, transparent 74%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 8% 78%, rgba(70,110,200,0.14) 0%, transparent 62%)",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="links-space__dust absolute inset-0" />

      {/* Realistic SVG comets — wide tapered dust plume, not a thin line */}
      <div className="links-space__comet" aria-hidden>
        <svg
          className="links-space__comet-svg"
          viewBox="0 0 420 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="comet-dust-a" x1="0" y1="70" x2="400" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffd090" stopOpacity="0" />
              <stop offset="35%" stopColor="#ffe2b0" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#fff4dc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="comet-ion-a" x1="20" y1="70" x2="390" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9ec8ff" stopOpacity="0" />
              <stop offset="55%" stopColor="#b8d8ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#eef6ff" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="comet-coma-a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(392 70) scale(36)">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#fff3d4" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#ffd080" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffd080" stopOpacity="0" />
            </radialGradient>
            <filter id="comet-blur-a" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter id="comet-soft-a" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          <path
            d="M10 70 C90 40, 210 28, 360 58 C300 70, 210 92, 90 100 C40 95, 18 82, 10 70 Z"
            fill="url(#comet-dust-a)"
            filter="url(#comet-blur-a)"
            opacity="0.75"
          />
          <path
            d="M40 70 C120 48, 230 42, 372 64 C320 70, 230 86, 120 90 C70 86, 50 78, 40 70 Z"
            fill="url(#comet-dust-a)"
            filter="url(#comet-soft-a)"
          />
          <path
            d="M80 66 C180 56, 280 54, 380 66 C300 68, 200 74, 110 74 C90 72, 84 68, 80 66 Z"
            fill="url(#comet-ion-a)"
            filter="url(#comet-soft-a)"
            opacity="0.85"
          />
          <g fill="#fff" opacity="0.55">
            <circle cx="210" cy="62" r="1.1" />
            <circle cx="245" cy="78" r="0.9" />
            <circle cx="280" cy="58" r="1.2" />
            <circle cx="310" cy="74" r="0.8" />
            <circle cx="335" cy="64" r="1" />
            <circle cx="355" cy="72" r="0.7" />
          </g>
          <circle cx="392" cy="70" r="34" fill="url(#comet-coma-a)" />
          <circle cx="392" cy="70" r="5.5" fill="#fff" />
          <circle cx="392" cy="70" r="2.2" fill="#fff8e8" />
        </svg>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 40%, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  )
}
