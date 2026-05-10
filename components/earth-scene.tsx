"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

/* ------------------------------------------------------------------
   Sun direction — right side, slightly up, partial front component.
   Gives 60-70 % of the visible hemisphere in daylight with a sharp
   terminator running left-of-centre for maximum drama.
   ------------------------------------------------------------------ */
const SUN = new THREE.Vector3(1.6, 0.55, 0.9).normalize()

/* ------------------------------------------------------------------
   Shared vertex shader — passes view-space AND world-space normals
   so fragment shaders can do both limb-brightening and sun-dot work.
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
    // Limb brightening (camera-space)
    float limb = pow(clamp(0.73 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.6);

    // Per-fragment sun angle
    float sd = dot(normalize(vWorldNormal), normalize(sunDir));

    // Narrow golden-hour band: peaks where sd ≈ 0 (terminator)
    float golden = exp(-pow(sd * 5.5, 2.0));

    // Lit vs dark side blend (0 = darkest, 1 = full sun)
    float lit = clamp(sd * 0.5 + 0.5, 0.0, 1.0);

    // Colour ramp
    vec3 darkBlue  = vec3(0.08, 0.22, 0.72);
    vec3 litBlue   = vec3(0.30, 0.62, 1.00);
    vec3 goldenHue = vec3(1.00, 0.58, 0.18);

    vec3 col = mix(darkBlue, litBlue, lit);
    col       = mix(col, goldenHue, golden * 0.80);

    // Slightly brighter on the sun side
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

  // Multi-stop radial: pure white core → warm gold → transparent orange edge
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

    /* ── Earth — day/night shader with golden-hour terminator ─────── */
    const EARTH_R  = 2.0
    const sunUniform = { value: SUN.clone() }

    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture:   { value: texDay },
        nightTexture: { value: texNight },
        normalMap:    { value: texNormal },
        specularMap:  { value: texSpec },
        sunDir:       sunUniform,
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

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;

        void main() {
          vec3  N      = normalize(vWorldNormal);
          float sd     = dot(N, normalize(sunDir));    // −1..1

          // ── Day/night blend ────────────────────────────────────────
          float dayMix  = smoothstep(-0.20, 0.30, sd);
          float diffuse = max(sd, 0.0);

          vec4 dayCol   = texture2D(dayTexture,   vUv);
          vec4 nightCol = texture2D(nightTexture, vUv);

          // Diffuse + subtle ambient on dark side
          vec4 lit = dayCol * (0.08 + 0.92 * diffuse);

          // ── Golden hour — narrow band at the terminator ────────────
          // Peaks where sd ≈ 0.08 (just inside the lit side of terminator)
          float goldenMask = exp(-pow((sd - 0.08) * 5.2, 2.0));
          vec3  goldenTint = vec3(1.00, 0.65, 0.22);
          lit.rgb = mix(lit.rgb, lit.rgb * goldenTint * 1.25, goldenMask * 0.80);

          // ── Full-sun warmth ────────────────────────────────────────
          float fullSun = smoothstep(0.45, 1.0, sd);
          lit.rgb       = mix(lit.rgb, lit.rgb * vec3(1.05, 1.02, 0.96), fullSun * 0.35);

          // ── City lights on dark side ───────────────────────────────
          float nightFace = 1.0 - smoothstep(-0.35, 0.05, sd);
          vec4  nightLit  = nightCol * nightFace * 2.1;

          // ── Specular (ocean glitter) ───────────────────────────────
          float specMask = texture2D(specularMap, vUv).r;
          float spec     = pow(diffuse, 62.0) * specMask * 0.95;
          vec3  specCol  = vec3(0.88, 0.93, 1.00) * spec;

          // ── Compose ────────────────────────────────────────────────
          gl_FragColor.rgb = mix(nightLit.rgb, lit.rgb, dayMix) + specCol;
          gl_FragColor.a   = 1.0;
        }
      `,
    })

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R, 80, 80),
      earthMat
    )
    // Start rotated so a nice continent mix is visible
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
    // Position the sun so its soft glow bleeds into the upper-right of
    // the frame from outside — visible as a warm bloom at the edge.
    const sunTex = createSunTexture()

    // Core glow
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
    // Place the sprite along the sun direction, just far enough that its
    // soft corona bleeds into the upper-right corner of the viewport.
    sunSprite.position.copy(SUN).multiplyScalar(16)
    sunSprite.scale.set(12, 12, 1)
    scene.add(sunSprite)

    // Wider diffuse corona around it
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

    /* ── Lighting ────────────────────────────────────────────────────
       Three.js lights aren't used by our custom shader, but they DO
       affect the sprite materials which respond to scene lighting.
       We keep a point light near the sun position so the sprites
       inherit a hint of warm illumination.
       ---------------------------------------------------------------- */
    // Key sunlight — warm, intense
    const keyLight = new THREE.DirectionalLight(0xfff8e4, 3.0)
    keyLight.position.copy(SUN).multiplyScalar(10)
    scene.add(keyLight)

    // Subtle blue fill from the opposite side (Earth-shine on dark side)
    const fillLight = new THREE.DirectionalLight(0x1a3880, 0.18)
    fillLight.position.set(-5, -1.5, -3)
    scene.add(fillLight)

    // Very dim ambient so the deep-space black stays rich
    scene.add(new THREE.AmbientLight(0x05080f, 1.0))

    /* ── Animation ───────────────────────────────────────────────── */
    const START_Z = 14
    const END_Z   = 3.6
    const START_Y = 0.8
    const END_Y   = 0.2
    const ZOOM_MS = 7000
    const t0      = performance.now()

    // Smooth, cinematic pull — slow deceleration like iPhone wallpaper
    function easeOutQuart(t: number) {
      return 1 - Math.pow(1 - t, 4)
    }

    let raf: number

    function animate() {
      raf = requestAnimationFrame(animate)

      const raw   = Math.min((performance.now() - t0) / ZOOM_MS, 1)
      const eased = easeOutQuart(raw)

      camera.position.z = START_Z + (END_Z - START_Z) * eased
      camera.position.y = START_Y + (END_Y - START_Y) * eased

      // Slow Earth rotation
      earth.rotation.y += 0.00042

      // Stars drift slightly — adds gentle parallax depth
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
