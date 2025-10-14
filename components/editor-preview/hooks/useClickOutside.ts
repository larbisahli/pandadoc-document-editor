import { useEffect, RefObject } from "react";

type Options = {
  enabled?: boolean; // run only when true
  ignoreRefs?: Array<RefObject<HTMLElement>>;
  ignoreSelectors?: string[]; // e.g. ['[data-rich-editor-toolbar]', '#RichEditorToolbar']
  events?: Array<"mousedown" | "touchstart" | "pointerdown">;
  capture?: boolean; // default true so it runs even if others stopPropagation
  onlyLeftMouse?: boolean; // ignore right/middle clicks
};

export function useClickOutside<
  T extends HTMLElement | HTMLDivElement | HTMLButtonElement | null,
>(
  ref: RefObject<T> | RefObject<T>[],
  onOutside: (e: MouseEvent | TouchEvent) => void,
  {
    enabled = true,
    ignoreRefs = [],
    ignoreSelectors = [],
    events = ["mousedown", "touchstart"],
    capture = true,
    onlyLeftMouse = true,
  }: Options = {},
) {
  useEffect(() => {
    if (!enabled) return;

    const targets = Array.isArray(ref) ? ref : [ref];

    const handler = (e: MouseEvent | TouchEvent) => {
      if (onlyLeftMouse && e instanceof MouseEvent && e.button !== 0) return;

      const target = e.target as Node | null;
      if (!target) return;

      // inside any target? -> ignore
      if (targets.some((r) => r.current && r.current.contains(target))) return;

      // inside any ignored ref? -> ignore
      if (ignoreRefs.some((r) => r.current && r.current.contains(target)))
        return;

      // inside any ignored selector? (supports portals/shadow via composedPath)
      const path = e.composedPath?.() as EventTarget[] | undefined;
      const matchesIgnoredSelector = (el: Element) =>
        ignoreSelectors.some((sel) => !!el.closest(sel));

      if (path?.some((n) => n instanceof Element && matchesIgnoredSelector(n)))
        return;
      if (!path && target instanceof Element && matchesIgnoredSelector(target))
        return;

      onOutside(e);
    };

    for (const ev of events)
      document.addEventListener(ev, handler, { capture });
    return () => {
      for (const ev of events)
        document.removeEventListener(ev, handler, { capture });
    };
  }, [
    enabled,
    onOutside,
    capture,
    onlyLeftMouse,
    events,
    ignoreRefs,
    ref,
    ignoreSelectors,
  ]);
}
