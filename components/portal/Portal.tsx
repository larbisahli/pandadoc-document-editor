// components/ui/Portal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({
  children,
  containerId = "portal-root",
}: {
  children: React.ReactNode;
  containerId?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (el) {
      setContainer(el);
      setMounted(true);
    }
  }, [containerId]);

  if (!mounted || !container) return null;

  return createPortal(children, container);
}
