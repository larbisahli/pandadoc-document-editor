import { PageId } from "@/interfaces/common";
import { setVisiblePageId } from "@/lib/features/layout/layoutSlice";
import { useAppDispatch } from "@/lib/hooks";
import {
  buildThresholds,
  getScrollTop,
  pickActivePage,
  shouldSwitch,
} from "@/utils/helpers/pageVisibilityObserver";
import { useEffect, useMemo, useRef } from "react";

type Options = {
  // Scroll container
  root?: HTMLElement | null;
  // A page must reach this visible ratio to switch (0 to 1)
  majorityThreshold?: number;
  // Debounce Redux updates (ms)
  debounceMs?: number;
  // Threshold for IntersectionObserver
  thresholdStep?: number;
  // Extra margin required to avoids flicker
  switchMargin?: number;
};

export function usePageVisibilityObserver(
  pageIds: string[],
  {
    root = null,
    majorityThreshold = 0.5,
    debounceMs = 80,
    thresholdStep = 0.1,
    switchMargin = 0.05,
  }: Options = {},
) {
  const dispatch = useAppDispatch();

  // Latest visible ratios per page
  const ratiosRef = useRef<Map<string, number>>(new Map());

  // Last committed visible page id
  const lastIdRef = useRef<string | null>(null);

  // Scroll direction: 1 = down, -1 = up
  const dirRef = useRef<1 | -1>(1);
  const lastScrollTopRef = useRef<number>(0);

  // Debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable DOM order index
  const domIndex = useMemo(() => {
    const m = new Map<string, number>();
    pageIds.forEach((id, i) => m.set(id, i));
    return m;
  }, [pageIds]);

  // Track scroll direction on the root
  useEffect(() => {
    const node: HTMLElement | Window = root ?? window;

    const onScroll = () => {
      const now = getScrollTop(root ?? null);
      const prev = lastScrollTopRef.current;
      if (now > prev) dirRef.current = 1;
      else if (now < prev) dirRef.current = -1;
      lastScrollTopRef.current = now;
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    // initialize
    onScroll();

    return () => node.removeEventListener("scroll", onScroll);
  }, [root]);

  // Observe pages & dispatch visible page id
  useEffect(() => {
    if (!pageIds.length) return;

    // Init ratios map so every id has a value
    ratiosRef.current = new Map(pageIds.map((id) => [id, 0]));

    const thresholds = buildThresholds(thresholdStep);

    const observer = new IntersectionObserver(
      (entries) => {
        // Update ratios for reported entries
        for (const e of entries) {
          const id = (e.target as HTMLElement).id;
          ratiosRef.current.set(id, e.isIntersecting ? e.intersectionRatio : 0);
        }

        // Debounce the decision & dispatch
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          const nextId = pickActivePage(
            pageIds,
            ratiosRef.current,
            domIndex,
            dirRef.current,
          );
          if (!nextId) return;

          if (
            shouldSwitch(
              lastIdRef.current,
              nextId,
              ratiosRef.current,
              majorityThreshold,
              switchMargin,
            )
          ) {
            lastIdRef.current = nextId;
            dispatch(setVisiblePageId(nextId as PageId));
          }
        }, debounceMs);
      },
      { root: root ?? null, threshold: thresholds },
    );

    // Start observing
    for (const id of pageIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      observer.disconnect();
      // Do not clear ratiosRef/lastIdRef so we keep some continuity if pageIds re-mount quickly
    };
  }, [
    pageIds,
    root,
    thresholdStep,
    majorityThreshold,
    switchMargin,
    debounceMs,
    dispatch,
    domIndex,
  ]);
}
