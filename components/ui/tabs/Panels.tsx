import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function TabPanels({ children, className }: Props) {
  return <div className={className ?? "pt-3"}>{children}</div>;
}
