<div align="center">

  # 🏎️ Scuderia Ferrari 488 GT3 — High-Performance 3D WebGL Showcase

  [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://scuderia-ferrari-webgl.vercel.app/)
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Three.js](https://img.shields.io/badge/Three.js-r185-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
  [![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-FFBA00.svg?style=for-the-badge)](./LICENSE)

  <p align="center">
    <strong>An Awwwards-caliber, 60–120 FPS interactive 3D WebGL automotive showcase dedicated to the championship-winning Ferrari 488 GT3.</strong>
    <br/>
    Engineered with zero-latency custom pointer physics, Draco-compressed 3D geometry, and kinetic scroll choreography.
  </p>

  <p align="center">
    <a href="https://scuderia-ferrari-webgl.vercel.app/"><strong>Explore Live Site »</strong></a> •
    <a href="#-benchmarks--optimization"><strong>Performance Benchmarks »</strong></a> •
    <a href="#-architecture"><strong>Architecture »</strong></a>
  </p>

</div>

---

## ⚡ Performance Benchmarks & Zero-Lag Engineering

| Metric | Before Optimization | After Optimization | Impact |
| :--- | :--- | :--- | :--- |
| **3D Model Size** | 3.97 MB (raw buffers) | **1.73 MB** (Draco compressed) | **-56.4% (-2.24 MB bandwidth)** |
| **Initial JS Entry Chunk** | 1,417 kB (monolith) | **28.41 kB** (`index.js`) | **-98.0% payload on first paint** |
| **Vendor Code Splitting** | Single un-split bundle | Modular chunks (`three`, `r3f`, `gsap`, `lenis`) | **Independent HTTP/2 browser caching** |
| **Off-Screen WebGL Load**| 3 Canvases running 60fps | Viewport-culled `frameloop="never"` | **0% GPU cycles when off-screen** |
| **Cursor Pointer Latency** | 75ms CSS transition delay | **0ms hardware-pinned (`translate3d`)** | **Absolute 1:1 tactile response** |
| **Glass Material Pass** | Full-screen transmission FBO copies | Transparent PBR tint (`transmission: 0`) | **Doubled WebGL rendering framerate** |
| **Scroll Inertia** | 1.5s heavy drag | **0.9s responsive kinetic damping** | **Fast, crisp tactile momentum** |

---

## ✨ Key Features

- **🏎️ Real-Time 3D Hero Staging:**
  - Interactive Ferrari 488 GT3 model with `PresentationControls` (isolated container drag physics), baked contact shadows (`frames={1}`), and natural mouse parallax tilt.
  - Multi-tone crimson concentric blueprint rings with hardware-accelerated GPU transforms.

- **🎯 Zero-Latency Scuderia Telemetry Cursor:**
  - **0ms Instant Pip**: Direct hardware-pinned laser optic center dot with micro-white focal point.
  - **Aerodynamic Reticle**: High-refresh RAF loop with velocity squash-and-stretch (`rotate(angle) scale(x, y)`).
  - **Contextual 3D HUD**: Reveals `ROTATE 3D` badge over the WebGL canvas and glowing aperture over interactive buttons.
  - **Shockwave Ripple**: Tactile expanding shockwave ring on click without layout thrashing.

- **🔬 Multi-Angle 3D Telemetry Inspection:**
  - Scroll-driven camera choreography inspecting the car across 3 distinct homologation stages:
    - `01 / 03 AERODYNAMICS`: Ground-effect front carbon splitter, dive planes, and downforce telemetry.
    - `02 / 03 CHASSIS`: Lightweight carbon fiber monocoque and side-intake pods.
    - `03 / 03 POWERTRAIN`: Mid-rear mounted 3.9L Twin-Turbo V8 producing 600 HP.

- **📊 Dual-Mode Telemetry Grid:**
  - Interactive switcher between **Powertrain Dynamics** and **Track Performance**.
  - Glassmorphic telemetry cards with dynamic animated progress gauge bars and Maranello homologation coordinates.

- **📸 Scuderia Design Excellence Gallery:**
  - Track photography with telemetry HUD badges, hover zoom effects, and full-screen detail modal lightbox with asynchronous lazy decoding.

- **🏁 Interactive 3D Drive-In & Park Finale:**
  - Scroll-triggered physics animation where the 3D race car drives in from off-screen left and smoothly brakes to park dead-center in front of the giant Ferrari wordmark.

---

## 🛠️ Tech Stack & Architecture

```text
src/
├── components/
│   ├── Ferrari.tsx            # Optimized GLTF model with Draco worker decoding
│   ├── sections/
│   │   ├── Hero.tsx           # PBR Staging, presentation controls, HUD wordmark
│   │   ├── Hotspots.tsx       # Pinned 3D camera choreography & telemetry cards
│   │   ├── Specs.tsx          # Dual-tab telemetry specifications & animated meters
│   │   ├── Gallery.tsx        # Responsive media grid & interactive detail modal
│   │   └── Footer.tsx         # 3D driving drive-in animation & legal links
│   └── ui/
│       ├── CustomCursor.tsx   # Zero-lag hardware cursor with velocity stretch
│       └── Preloader.tsx      # Real 3D asset progress tracker via Drei useProgress
├── hooks/
│   ├── useLenis.ts            # High-performance 0.9s kinetic smooth scrolling
│   ├── useParallax.ts         # Multi-layer GSAP scroll scrubbing
│   └── useInView.ts           # Viewport visibility tracking
├── lib/
│   └── parallax.ts            # Speed constants & telemetry coordinates
├── store/
│   └── index.ts               # Global state
├── index.css                  # Design tokens, cursor removal, and font definitions
└── App.tsx                    # Code-split lazy loaded section assembly
```

---

## 🚀 Quickstart

### 1. Clone the repository
```bash
git clone https://github.com/Adityapawar7/scuderia-ferrari-webgl.git
cd scuderia-ferrari-webgl
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

### 5. Preview production build
```bash
npm run preview
```

---

## 👨‍💻 Author

**Aditya Pawar**
- GitHub: [@Adityapawar7](https://github.com/Adityapawar7)
- Email: [adityapawarone8@gmail.com](mailto:adityapawarone8@gmail.com)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
