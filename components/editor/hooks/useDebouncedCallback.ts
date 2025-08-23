import React, { useEffect, useMemo, useRef } from "react";

type Debounced<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
  flush: (...args: Parameters<T>) => void;
};

/**
 * Debounce a callback with stable identity.
 * - Recreated only when `delay` or `deps` change.
 * - Always invokes the latest `fn` implementation.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
  deps: React.DependencyList = [],
): Debounced<T> {
  const latestRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the latest callback without changing the debounced fn identity
  useEffect(() => {
    latestRef.current = fn;
  }, [fn]);

  // Create the debounced wrapper only when delay/deps change
  const debounced = useMemo<Debounced<T>>(() => {
    const wrapped = ((...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        // Call the latest version of the callback
        latestRef.current(...args);
      }, delay);
    }) as Debounced<T>;

    wrapped.cancel = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    // onSubmit={() => debounced.flush(currentQuery)}
    // commit last data now
    wrapped.flush = (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      latestRef.current(...args);
    };

    return wrapped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  // Auto-cancel on unmount or when the debounced fn is recreated
  React.useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
}
