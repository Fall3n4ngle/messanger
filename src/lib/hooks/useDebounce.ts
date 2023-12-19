import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return debouncedValue;
};

function debounce(func: Function, wait: number) {
  let timeout: string | number | NodeJS.Timeout | undefined;
  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function useDebouncedCallback(callback: Function, delay: number) {
  const debouncedFn = useRef(debounce(callback, delay));
  return debouncedFn.current;
}
