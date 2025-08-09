import React from "react";
import { useTabs } from "./Tabs";

type Props = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export function TabPanel({ value, children, className }: Props) {
  const { active, idBase } = useTabs();
  const hidden = active !== value;
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${value}`}
      aria-labelledby={`${idBase}-tab-${value}`}
      hidden={hidden}
      className={className}
    >
      {!hidden && children}
    </div>
  );
}
