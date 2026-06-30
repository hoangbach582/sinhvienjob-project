import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook để trigger animation khi element scroll vào viewport
 * @param {Object} options - IntersectionObserver options
 * @param {boolean} triggerOnce - Chỉ trigger animation 1 lần (mặc định: true)
 * @returns {[React.RefObject, boolean]} - Ref để gán vào element và trạng thái isVisible
 */
export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }, triggerOnce = true) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isVisible && triggerOnce) return;

    const currentRef = ref.current;
    
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce) {
          observer.unobserve(currentRef);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, triggerOnce, isVisible]);

  return [ref, isVisible];
}
