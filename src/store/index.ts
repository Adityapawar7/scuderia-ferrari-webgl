import { create } from 'zustand';

interface AppState {
  scrollProgress: number;
  activeSection: string;
  isLoaded: boolean;
  reducedMotion: boolean;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
  setIsLoaded: (loaded: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  isLoaded: false,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
}));
