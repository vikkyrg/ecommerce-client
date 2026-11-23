import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal hook using native IntersectionObserver.
 * Respects prefers-reduced-motion for accessibility.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - Viewport intersection ratio to trigger animation.
 * @param {string} [options.rootMargin='0px 0px -40px 0px'] - Margin around the root.
 * @param {boolean} [options.once=true] - Whether the reveal should happen only once.
 * @param {number} [options.delay=0] - Additional delay before triggering visible state in ms.
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  delay = 0
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion or window doesn't support IntersectionObserver, reveal immediately
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let timeoutId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          if (timeoutId) clearTimeout(timeoutId);
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, once, delay]);

  return [ref, isVisible];
}

export default useScrollReveal;
