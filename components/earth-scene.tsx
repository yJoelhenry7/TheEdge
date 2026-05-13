"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

/* ------------------------------------------------------------------
   Sun direction — right side, slightly up, partial front component.
   ------------------------------------------------------------------ */
const SUN = new THREE.Vector3(1.6, 0.55, 0.9).normalize()

/* ------------------------------------------------------------------
   India geography
   Longitude 78°E  → texture u = (78+180)/360  ≈ 0.7167
   Latitude  20°N  → texture v = (90−20)/180   ≈ 0.3889

   Three.js SphereGeometry: phi=u×2π, vertex z = R·sin(phi)·sin(polar).
   At phi=π/2 (u=0.25) z is maximum → that face looks at the camera.
   After earth.rotation.y = α: the camera sees phi = π/2 − α, i.e. u = 0.25 − α/(2π).
   Invert: α = (0.25 − INDIA_U) × 2π ≈ −2.932 rad
   ------------------------------------------------------------------ */
const INDIA_U     = (78 + 180) / 360               // ≈ 0.7167  (longitude 78°E)
// Shader UV.y: geometry pushes (u, 1-v) so north pole → UV.y=1.
// India 20°N → UV.y = (90+20)/180 = 0.6111
const INDIA_UV_Y  = (90 + 20)  / 180               // ≈ 0.6111
const INDIA_ROT_Y = (0.25 - INDIA_U) * Math.PI * 2 // ≈ −2.932 rad

/* ------------------------------------------------------------------
   India world-space position when the globe is stopped
   (computed from spherical coords + earth.rotation.y + earthGroup tilt)
   Approximate result: (−0.273, 0.627, 1.880), magnitude ≈ EARTH_R = 2.0
   ------------------------------------------------------------------ */
const INDIA_WORLD = new THREE.Vector3(-0.273, 0.627, 1.880)

/* ------------------------------------------------------------------
   Shared vertex shader
   ------------------------------------------------------------------ */
const ATM_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  void main() {
    vNormal      = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/* ------------------------------------------------------------------
   Inner atmosphere — tight limb glow, golden at the terminator.
   ------------------------------------------------------------------ */
const INNER_ATM_FRAG = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vNormal;
  varying vec3 vWorldNormal;

  void main() {
    float limb = pow(clamp(0.73 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.6);
    float sd = dot(normalize(vWorldNormal), normalize(sunDir));
    float golden = exp(-pow(sd * 5.5, 2.0));
    float lit = clamp(sd * 0.5 + 0.5, 0.0, 1.0);
    vec3 darkBlue  = vec3(0.08, 0.22, 0.72);
    vec3 litBlue   = vec3(0.30, 0.62, 1.00);
    vec3 goldenHue = vec3(1.00, 0.58, 0.18);
    vec3 col = mix(darkBlue, litBlue, lit);
    col       = mix(col, goldenHue, golden * 0.80);
    float brightness = 0.65 + 0.35 * lit;
    gl_FragColor = vec4(col, 1.0) * limb * brightness;
  }
`

/* ------------------------------------------------------------------
   Outer halo — wider, softer, warm-orange on the sun side.
   ------------------------------------------------------------------ */
const OUTER_HALO_FRAG = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vNormal;
  varying vec3 vWorldNormal;

  void main() {
    float limb   = pow(clamp(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 4.8);
    float sd     = dot(normalize(vWorldNormal), normalize(sunDir));
    float golden = exp(-pow(sd * 4.8, 2.0));
    float lit    = clamp(sd * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(vec3(0.10, 0.28, 0.75), vec3(0.20, 0.48, 0.95), lit);
    col       = mix(col, vec3(0.95, 0.50, 0.10), golden * 0.55);
    gl_FragColor = vec4(col, 1.0) * limb * 0.32;
  }
`

/* ------------------------------------------------------------------
   Canvas-generated sun glow texture
   ------------------------------------------------------------------ */
function createSunTexture(): THREE.Texture {
  const S = 512
  const canvas = document.createElement("canvas")
  canvas.width  = S
  canvas.height = S
  const ctx = canvas.getContext("2d")!
  const cx  = S / 2
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  g.addColorStop(0.00, "rgba(255, 255, 245, 1.00)")
  g.addColorStop(0.06, "rgba(255, 248, 220, 0.96)")
  g.addColorStop(0.15, "rgba(255, 235, 170, 0.82)")
  g.addColorStop(0.30, "rgba(255, 215, 110, 0.58)")
  g.addColorStop(0.52, "rgba(255, 185,  60, 0.30)")
  g.addColorStop(0.72, "rgba(255, 155,  30, 0.12)")
  g.addColorStop(1.00, "rgba(255, 120,   0, 0.00)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(canvas)
}

/* ------------------------------------------------------------------
   India ambient glow texture — warm amber halo
   ------------------------------------------------------------------ */
function createIndiaGlowTexture(): THREE.Texture {
  const S = 256
  const canvas = document.createElement("canvas")
  canvas.width  = S
  canvas.height = S
  const ctx = canvas.getContext("2d")!
  const cx  = S / 2
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  g.addColorStop(0.00, "rgba(255, 210,  90, 0.92)")
  g.addColorStop(0.18, "rgba(255, 165,  45, 0.68)")
  g.addColorStop(0.42, "rgba(255, 110,  20, 0.28)")
  g.addColorStop(0.70, "rgba(255,  70,   5, 0.08)")
  g.addColorStop(1.00, "rgba(255,  40,   0, 0.00)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(canvas)
}

/* ------------------------------------------------------------------
   Starfield — uniform sphere distribution
   ------------------------------------------------------------------ */
function createStarfield(): THREE.Points {
  const N   = 12000
  const pos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const theta = 2 * Math.PI * Math.random()
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 500 + Math.random() * 200
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  const geom = new THREE.BufferGeometry()
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  return new THREE.Points(
    geom,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
    })
  )
}

/* ================================================================== */

export default function EarthScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    /* ── Renderer ─────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000)
    mount.appendChild(renderer.domElement)

    /* ── Scene & Camera ───────────────────────────────────────────── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 2000)
    camera.position.set(0, 0.8, 14)

    /* ── Stars ────────────────────────────────────────────────────── */
    const stars = createStarfield()
    scene.add(stars)

    /* ── Textures ─────────────────────────────────────────────────── */
    const loader    = new THREE.TextureLoader()
    const texDay    = loader.load("/textures/earth_day.jpg")
    const texNormal = loader.load("/textures/earth_normal.jpg")
    const texSpec   = loader.load("/textures/earth_specular.jpg")
    const texNight  = loader.load("/textures/earth_lights.png")
    texDay.colorSpace   = THREE.SRGBColorSpace
    texNight.colorSpace = THREE.SRGBColorSpace

    /* ── Earth group (23.5° axial tilt) ───────────────────────────── */
    const earthGroup = new THREE.Group()
    earthGroup.rotation.z = (23.5 * Math.PI) / 180
    scene.add(earthGroup)

    /* ── India highlight uniform ──────────────────────────────────── */
    const EARTH_R          = 2.0
    const sunUniform       = { value: SUN.clone() }
    const indiaHighlightU  = { value: 0.0 }

    /* ── Earth — day/night shader + India glow ────────────────────── */
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture:     { value: texDay },
        nightTexture:   { value: texNight },
        normalMap:      { value: texNormal },
        specularMap:    { value: texSpec },
        sunDir:         sunUniform,
        indiaHighlight: indiaHighlightU,
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;

        void main() {
          vUv          = uv;
          vNormal      = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D normalMap;
        uniform sampler2D specularMap;
        uniform vec3      sunDir;
        uniform float     indiaHighlight;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;

        void main() {
          vec3  N      = normalize(vWorldNormal);
          float sd     = dot(N, normalize(sunDir));

          // ── Day/night blend ───────────────────────────────────────
          float dayMix  = smoothstep(-0.20, 0.30, sd);
          float diffuse = max(sd, 0.0);

          vec4 dayCol   = texture2D(dayTexture,   vUv);
          vec4 nightCol = texture2D(nightTexture, vUv);

          vec4 lit = dayCol * (0.08 + 0.92 * diffuse);

          // ── Golden hour at terminator ─────────────────────────────
          float goldenMask = exp(-pow((sd - 0.08) * 5.2, 2.0));
          vec3  goldenTint = vec3(1.00, 0.65, 0.22);
          lit.rgb = mix(lit.rgb, lit.rgb * goldenTint * 1.25, goldenMask * 0.80);

          // ── Full-sun warmth ───────────────────────────────────────
          float fullSun = smoothstep(0.45, 1.0, sd);
          lit.rgb       = mix(lit.rgb, lit.rgb * vec3(1.05, 1.02, 0.96), fullSun * 0.35);

          // ── City lights on dark side ──────────────────────────────
          float nightFace = 1.0 - smoothstep(-0.35, 0.05, sd);
          vec4  nightLit  = nightCol * nightFace * 2.1;

          // ── Specular (ocean glitter) ──────────────────────────────
          float specMask = texture2D(specularMap, vUv).r;
          float spec     = pow(diffuse, 62.0) * specMask * 0.95;
          vec3  specCol  = vec3(0.88, 0.93, 1.00) * spec;

          // ── Compose ───────────────────────────────────────────────
          gl_FragColor.rgb = mix(nightLit.rgb, lit.rgb, dayMix) + specCol;
          gl_FragColor.a   = 1.0;

          // ── India warm glow ───────────────────────────────────────
          // Centre: u ≈ 0.7167 (lon 78°E), UV.y ≈ 0.6111 (lat 20°N, north-pole=1)
          // σ_u = 0.062, σ_v = 0.090  → covers the subcontinent shape
          vec2  dUV   = vUv - vec2(0.7167, 0.6111);
          float dist2 = (dUV.x * dUV.x) / 0.00384 + (dUV.y * dUV.y) / 0.0081;
          float iglow = exp(-dist2 * 0.5) * indiaHighlight;
          // Warm brightening + saffron-gold tint
          gl_FragColor.rgb = mix(
            gl_FragColor.rgb,
            gl_FragColor.rgb * 1.38 + vec3(0.55, 0.22, 0.01),
            iglow * 0.38
          );
        }
      `,
    })

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R, 80, 80),
      earthMat
    )
    // Globe tour: start from East Asia / Pacific view
    earth.rotation.y = -Math.PI * 0.28
    earthGroup.add(earth)

    /* ── Inner atmosphere ─────────────────────────────────────────── */
    earthGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_R * 1.055, 64, 64),
        new THREE.ShaderMaterial({
          uniforms: { sunDir: sunUniform },
          vertexShader: ATM_VERT,
          fragmentShader: INNER_ATM_FRAG,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        })
      )
    )

    /* ── Outer halo ───────────────────────────────────────────────── */
    earthGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_R * 1.26, 64, 64),
        new THREE.ShaderMaterial({
          uniforms: { sunDir: sunUniform },
          vertexShader: ATM_VERT,
          fragmentShader: OUTER_HALO_FRAG,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        })
      )
    )

    /* ── Sun glow sprite ──────────────────────────────────────────── */
    const sunTex = createSunTexture()

    const sunSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.92,
        color: 0xfff9e8,
        depthTest: false,
        depthWrite: false,
      })
    )
    sunSprite.position.copy(SUN).multiplyScalar(16)
    sunSprite.scale.set(12, 12, 1)
    scene.add(sunSprite)

    const coronaSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.38,
        color: 0xffe0a0,
        depthTest: false,
        depthWrite: false,
      })
    )
    coronaSprite.position.copy(SUN).multiplyScalar(14)
    coronaSprite.scale.set(32, 32, 1)
    scene.add(coronaSprite)

    /* ── India glow sprite ────────────────────────────────────────── */
    // Placed at India's computed world position (magnitude ≈ EARTH_R)
    // pushed outward by 10 % to sit just above the surface.
    const indiaGlowMat = new THREE.SpriteMaterial({
      map: createIndiaGlowTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    })
    const indiaSprite = new THREE.Sprite(indiaGlowMat)
    indiaSprite.position.copy(INDIA_WORLD).multiplyScalar(1.12)
    indiaSprite.scale.set(1.6, 1.6, 1)
    scene.add(indiaSprite)

    /* ── Lights ───────────────────────────────────────────────────── */
    const keyLight = new THREE.DirectionalLight(0xfff8e4, 3.0)
    keyLight.position.copy(SUN).multiplyScalar(10)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x1a3880, 0.18)
    fillLight.position.set(-5, -1.5, -3)
    scene.add(fillLight)

    scene.add(new THREE.AmbientLight(0x05080f, 1.0))

    /* ── Animation constants ──────────────────────────────────────── */

    // Camera start → end
    const START_Z  = 14,    END_Z  = 3.6
    const START_Y  = 0.8,   END_Y  = 0.45  // slightly higher to centre on India (~20°N)

    // Globe rotation: 1 full clockwise revolution then decelerate onto India.
    // DELTA_ROT = (INDIA_ROT_Y − START_ROT) − 2π  (negative = clockwise from above)
    const START_ROT = -Math.PI * 0.28                           // ≈ −0.879 rad  (mid-Atlantic start)
    const DELTA_ROT = (INDIA_ROT_Y - START_ROT) - Math.PI * 2  // ≈ −8.336 rad

    // Timing
    const ANIM_MS        = 9500   // spin + zoom duration
    const GLOW_DELAY_MS  = 8000   // ms after t0 when India highlight starts
    const GLOW_RISE_MS   = 2500   // ms for glow to reach full intensity

    // lookAt targets: default centre → nudge toward India's screen position
    const lookAtStart = new THREE.Vector3(0, 0, 0)
    const lookAtIndia = new THREE.Vector3(-0.10, 0.28, 0)

    /* ── Easing ───────────────────────────────────────────────────── */
    function easeOutQuart(t: number) {
      return 1 - Math.pow(1 - t, 4)
    }

    const t0 = performance.now()
    let raf: number

    // Idle breathing: ±4° sine oscillation around India, 12-second period
    const BREATH_AMP    = 0.070   // radians (~4°)
    const BREATH_PERIOD = 12000   // ms for one full cycle

    /* ── Animation loop ───────────────────────────────────────────── */
    function animate() {
      raf = requestAnimationFrame(animate)

      const elapsed = performance.now() - t0

      // ── Camera zoom + globe spin (same easing) ─────────────────
      const rawMain  = Math.min(elapsed / ANIM_MS, 1)
      const eased    = easeOutQuart(rawMain)

      camera.position.z = START_Z + (END_Z - START_Z) * eased
      camera.position.y = START_Y + (END_Y - START_Y) * eased

      if (rawMain < 1) {
        // Phase 1 – spin + zoom in
        earth.rotation.y = START_ROT + DELTA_ROT * eased
      } else {
        // Phase 2 – settled on India: gentle breathing oscillation
        const idleElapsed = elapsed - ANIM_MS
        earth.rotation.y =
          INDIA_ROT_Y +
          Math.sin((idleElapsed / BREATH_PERIOD) * Math.PI * 2) * BREATH_AMP
      }

      // ── India glow phase ───────────────────────────────────────
      const glowElapsed = Math.max(0, elapsed - GLOW_DELAY_MS)
      const glowT       = Math.min(glowElapsed / GLOW_RISE_MS, 1)
      const glowEased   = glowT * glowT  // ease-in for a gentle build

      indiaHighlightU.value    = glowEased
      indiaGlowMat.opacity     = glowEased * 0.70

      // ── Camera lookAt: subtly re-centre on India as glow rises ─
      const lookTarget = lookAtStart.clone().lerp(lookAtIndia, glowEased)
      camera.lookAt(lookTarget)

      // ── Stars slow drift ───────────────────────────────────────
      stars.rotation.y += 0.000014

      renderer.render(scene, camera)
    }

    animate()

    /* ── Resize ──────────────────────────────────────────────────── */
    function onResize() {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    /* ── Cleanup ─────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />
}
