import * as React from "react";

/**
 * useClickOutside
 * Detects clicks/taps outside of the given ref(s) and runs `onOutside`.
 *
 * @param refs - a single ref or an array of refs to check against
 * @param onOutside - callback fired when a click/touch is outside
 */
export function useClickOutside<
  T extends HTMLElement | HTMLDivElement | HTMLButtonElement | null,
>(
  refs: React.RefObject<T> | React.RefObject<T>[],
  onOutside: (event: MouseEvent | TouchEvent | PointerEvent) => void,
) {
  const handlerRef = React.useRef(onOutside);

  // always keep the latest callback without reattaching listeners
  React.useEffect(() => {
    handlerRef.current = onOutside;
  }, [onOutside]);

  React.useEffect(() => {
    const refArray = Array.isArray(refs) ? refs : [refs];

    const handleEvent = (event: MouseEvent | TouchEvent | PointerEvent) => {
      for (const ref of refArray) {
        const el = ref.current;
        if (el && el.contains(event.target as Node)) {
          return; // inside one of the refs → ignore
        }
      }
      handlerRef.current(event);
    };

    // use capture phase to catch early
    document.addEventListener("mousedown", handleEvent, true);
    document.addEventListener("touchstart", handleEvent, true);
    document.addEventListener("pointerdown", handleEvent, true);

    return () => {
      document.removeEventListener("mousedown", handleEvent, true);
      document.removeEventListener("touchstart", handleEvent, true);
      document.removeEventListener("pointerdown", handleEvent, true);
    };
  }, [refs]);
}
