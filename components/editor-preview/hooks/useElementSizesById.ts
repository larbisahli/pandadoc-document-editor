"use client";
import { getPageSize } from "@/utils/helpers/alignmentGuides";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Options = {
  throttle?: number;
  onChange?: (size: { width: number; height: number }) => void;
  emitInitial?: boolean;
};

export function useElementSizesById(
  pageId: string | null | undefined,
  { throttle = 0, onChange, emitInitial = false }: Options = {},
) {
  const [sizes, setSizes] = useState({ width: 0, height: 0 });
  const last = useRef<number>(-1);
  const raf = useRef<number | null>(null);
  const timer = useRef<number | null>(null);

  const commit = (
    {
      width,
      height,
    }: {
      width: number;
      height: number;
    },
    isInitial = false,
  ) => {
    if (height === last.current) return;
    last.current = height;
    setSizes({ width, height });
    if (!isInitial || emitInitial) onChange?.({ width, height });
  };

  useIsoLayoutEffect(() => {
    if (typeof document === "undefined" || !pageId) return;

    const el = document.getElementById(pageId);
    if (!el) return;

    const measure = (isInitial = false) => {
      const size = getPageSize(pageId);
      commit(size, isInitial);
    };

    // initial
    measure(true);

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => {
        if (throttle > 0) {
          if (timer.current != null) return;
          timer.current = window.setTimeout(() => {
            timer.current = null;
            measure();
          }, throttle);
        } else {
          if (raf.current) cancelAnimationFrame(raf.current);
          raf.current = requestAnimationFrame(() => measure());
        }
      });
      ro.observe(el);

      // Fallback for font/image loads that may not trigger RO in some cases
      const onWinResize = () => measure();
      window.addEventListener("resize", onWinResize);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", onWinResize);
        if (raf.current) cancelAnimationFrame(raf.current);
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
      };
    } else {
      // Legacy fallback: listen to resize + DOM mutations
      const onWinResize = () => measure();
      window.addEventListener("resize", onWinResize);
      const mo = new MutationObserver(() => measure());
      mo.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => {
        window.removeEventListener("resize", onWinResize);
        mo.disconnect();
      };
    }
  }, [pageId, throttle, onChange, emitInitial]);

  return sizes;
}
