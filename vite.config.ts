import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) {
              return 'vendor-three';
            }
            if (id.includes('@react-three')) {
              return 'vendor-r3f';
            }
            if (id.includes('three-stdlib')) {
              return 'vendor-three-stdlib';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('lenis')) {
              return 'vendor-lenis';
            }
            if (id.includes('react') || id.includes('zustand')) {
              return 'vendor-framework';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
