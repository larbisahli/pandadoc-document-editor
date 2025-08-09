import clsx from "clsx";
import React, { useRef } from "react";
import { useTabs } from "./Tabs";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function TabList({ children, className }: Props) {
  const { active, setActive, idBase } = useTabs();
  const listRef = useRef<HTMLUListElement>(null);

  // Get enabled tab buttons
  const getTabs = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([aria-disabled="true"])',
      ) ?? [],
    );

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    const tabs = getTabs();
    if (tabs.length === 0) return;
    const idx = tabs.findIndex((el) => el.id === `${idBase}-tab-${active}`);
    const focusAt = (i: number) => tabs[i]?.focus();

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const next = (idx + 1) % tabs.length;
        setActive(tabs[next].dataset.value!);
        focusAt(next);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const prev = (idx - 1 + tabs.length) % tabs.length;
        setActive(tabs[prev].dataset.value!);
        focusAt(prev);
        break;
      }
      case "Home":
        e.preventDefault();
        setActive(tabs[0].dataset.value!);
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        setActive(tabs[tabs.length - 1].dataset.value!);
        focusAt(tabs.length - 1);
        break;
    }
  };

  return (
    <ul
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={clsx("relative flex border-b border-gray-300", className)}
    >
      {children}
    </ul>
  );
}
