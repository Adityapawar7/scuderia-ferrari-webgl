# 🏎️ Scuderia Ferrari 488 GT3 — Interactive 3D Experience

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-v9-black?style=flat-square&logo=react&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-FF0055?style=flat-square)](https://lenis.darkroom.engineering/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-v8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

An award-winning caliber, high-performance interactive 3D WebGL automotive showcase dedicated to the **Ferrari 488 GT3**. Built with a modern creative development stack featuring React 19, Three.js, React Three Fiber, GSAP ScrollTrigger, Lenis Smooth Scroll, and custom typography.

---

## ✨ Features

- **🏎️ Real-Time 3D Hero Staging:**
  - 3D interactive Ferrari 488 GT3 model with `PresentationControls`, physical contact shadows, dynamic environment lighting, and natural mouse parallax tilt.
  - Multi-tone crimson concentric blueprint rings and giant background wordmark typography.

- **🔬 Multi-Angle 3D Telemetry Inspection:**
  - Smooth scroll-driven camera choreography inspecting the car across 3 distinct engineering stages:
    - `01 / 03 AERODYNAMICS`: Ground effect, front carbon splitter, and downforce.
    - `02 / 03 CHASSIS`: Lightweight carbon fiber monocoque and side-intake pods.
    - `03 / 03 POWERTRAIN`: Mid-rear mounted 3.9L Twin-Turbo V8.

- **📊 Dual-Mode Track Telemetry Grid:**
  - Interactive tab switcher between **Powertrain Dynamics** and **Track Performance**.
  - Glassmorphic telemetry cards with dynamic animated progress gauge bars and Maranello homologation coordinates.

- **📸 Scuderia Design Excellence Gallery:**
  - High-definition track photography with telemetry HUD badges, hover zoom effects, and full-screen detail modal lightbox.

- **🏁 Interactive 3D Drive-In & Park Finale:**
  - Scroll-triggered physics animation where the 3D race car drives in from off-screen left and smoothly brakes to park dead-center in front of the giant Ferrari wordmark.

- **🧈 Inertial Smooth Scroll Experience:**
  - Hardware-accelerated smooth scrolling powered by `@studio-freight/lenis` synchronized with GSAP `ScrollTrigger`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **3D & WebGL** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei) |
| **Animation & Scrubbing** | [GSAP (GreenSock)](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ferrari-488-gt3-experience.git
   cd ferrari-488-gt3-experience
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
ferrari/
├── public/
│   ├── 2018_ferrari_488_gt3.glb   # High-poly 3D Ferrari GLTF model
│   ├── ferrari-logo.svg           # Authentic Scuderia Ferrari vector shield
│   └── fonts/
│       └── gc-epicpro.ttf         # Epic Pro display font asset
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx           # 3D interactive hero with blueprint rings
│   │   │   ├── Hotspots.tsx       # 3-stage scroll telemetry 3D inspection
│   │   │   ├── Specs.tsx          # Dual-mode track telemetry cards
│   │   │   ├── Gallery.tsx        # High-res photography & detail modal
│   │   │   └── Footer.tsx         # 3D drive-in car & parking finale
│   │   ├── ui/
│   │   │   └── Preloader.tsx      # GSAP preloader screen
│   │   └── Ferrari.tsx            # Optimized GLTF JSX 3D model component
│   ├── hooks/
│   │   ├── useLenis.ts            # Smooth scroll initialization
│   │   └── useParallax.ts         # Directional scroll parallax hooks
│   ├── App.tsx                    # Main application assembly
│   ├── main.tsx                   # React root mount
│   └── index.css                  # Global styles, font definitions & design tokens
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License & Disclaimer

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

> **Disclaimer:** This project is a non-commercial, educational fan-tribute and creative technology showcase. All trademarks, vehicle designs, and brand identities (including *Ferrari*, the *Cavallino Rampante* shield, and *488 GT3*) are the intellectual property of **Ferrari S.p.A.** and their respective trademark holders.
