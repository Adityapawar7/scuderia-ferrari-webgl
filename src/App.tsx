import { useEffect } from 'react';
import Hero from './components/sections/Hero';
import Hotspots from './components/sections/Hotspots';
import Specs from './components/sections/Specs';
import Gallery from './components/sections/Gallery';
import Footer from './components/sections/Footer';
import Preloader from './components/ui/Preloader';
import { useLenisScroll } from './hooks/useLenis';
import { useParallax } from './hooks/useParallax';
import { useStore } from './store';

function App() {
  useLenisScroll();
  useParallax(); // Global parallax
  const setIsLoaded = useStore(state => state.setIsLoaded);

  useEffect(() => {
    // Temporary simulation of asset loading until 3D model is injected
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [setIsLoaded]);

  return (
    <>
      <div className="noise-overlay pointer-events-none z-50" />
      <Preloader />
      
      <main className="relative w-full text-white bg-transparent selection:bg-white selection:text-crimson-dark">
        <Hero />
        <Hotspots />
        <Specs />
        <Gallery />
        <Footer />
      </main>
    </>
  );
}

export default App;
