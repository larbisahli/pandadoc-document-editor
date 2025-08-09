import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

type TabsContextType = {
  active: string;
  setActive: (v: string) => void;
  idBase: string;
};

const TabsCtx = createContext<TabsContextType | null>(null);

export const useTabs = () => {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("useTabs must be used within <Tabs>");
  return ctx;
};

type TabsProps = {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
};

export function Tabs({
  value,
  onChange,
  defaultValue,
  children,
  className,
}: TabsProps) {
  const internalId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");

  const active = value ?? uncontrolled;

  const setActive = useCallback(
    (v: string) => (onChange ? onChange(v) : setUncontrolled(v)),
    [onChange],
  );

  const ctx = useMemo(
    () => ({ active, setActive, idBase: internalId }),
    [active, internalId, setActive],
  );

  return (
    <TabsCtx.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}
