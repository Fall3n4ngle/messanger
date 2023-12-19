import { useRef } from "react";

function throttle(func: Function, limit: number) {
  let inThrottle: boolean | undefined;
  return function throttledFunction(...args: any) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function useThrottledCallback(callback: Function, limit: number) {
  const throttledFn = useRef(throttle(callback, limit));
  return throttledFn.current;
}
