import { lazy, Suspense } from 'react';
import Hero from './components/sections/Hero';
import Preloader from './components/ui/Preloader';
import CustomCursor from './components/ui/CustomCursor';
import { useLenisScroll } from './hooks/useLenis';
import { useParallax } from './hooks/useParallax';

// Lazy load below-the-fold sections for faster initial paint & bundle splitting
const Hotspots = lazy(() => import('./components/sections/Hotspots'));
const Specs = lazy(() => import('./components/sections/Specs'));
const Gallery = lazy(() => import('./components/sections/Gallery'));
const Footer = lazy(() => import('./components/sections/Footer'));

function App() {
  useLenisScroll();
  useParallax(); // Global parallax

  return (
    <>
      <CustomCursor />
      <div className="noise-overlay pointer-events-none z-50" />
      <Preloader />
      
      <main className="relative w-full text-white bg-transparent selection:bg-white selection:text-crimson-dark">
        <Hero />
        <Suspense fallback={null}>
          <Hotspots />
          <Specs />
          <Gallery />
          <Footer />
        </Suspense>
      </main>
    </>
  );
}

export default App;
