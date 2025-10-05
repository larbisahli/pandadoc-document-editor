"use client";
import type { AppStore, RootState } from "@/lib/store";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

type Props = {
  children: ReactNode;
  preloadedState?: Partial<RootState>;
};

export const StoreProvider = ({ children, preloadedState }: Props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store once, using server-provided preloadedState if any
    storeRef.current = makeStore(preloadedState);
  }

  useEffect(() => {
    if (!storeRef.current) return;
    const unsubscribe = setupListeners(storeRef.current.dispatch);
    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};
