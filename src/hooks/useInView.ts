import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
  externalRef?: React.RefObject<T | null>
) {
  const { rootMargin = '200px', threshold = 0, once = false } = options;
  const internalRef = useRef<T>(null);
  const targetRef = externalRef || internalRef;
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        if (inView && once) {
          observer.unobserve(el);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, rootMargin, threshold, once]);

  return [targetRef, isInView] as const;
}
