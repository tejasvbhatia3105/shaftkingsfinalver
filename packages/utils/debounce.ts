import { useEffect, useRef } from 'react';

function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  delay: number = 1000
): () => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const previousValueRef = useRef<T | undefined>(value);

  useEffect(() => {
    if (value === null || value === undefined) return;

    if (value !== previousValueRef.current) {
      const clearPreviousTimeout = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      clearPreviousTimeout();

      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);

      previousValueRef.current = value;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, callback, delay]);

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}

export default useDebounce;
