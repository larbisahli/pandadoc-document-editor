import React, { useState } from "react";
import clsx from "clsx";

type Placement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
  className?: string;
  tooltipClassName?: string;
  onOpenChange?: (open: boolean) => void;
  offset?: number;
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  className = "",
  tooltipClassName = "",
  onOpenChange,
  offset = 8,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (v: boolean) => {
    setOpen(v);
    onOpenChange?.(v);
  };

  const handleEnter = () => handleOpen(true);
  const handleLeave = () => handleOpen(false);

  const style: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: "absolute" };
    switch (placement) {
      case "top":
        return {
          ...base,
          bottom: `calc(100% + ${offset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          ...base,
          top: `calc(100% + ${offset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          ...base,
          right: `calc(100% + ${offset}px)`,
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "right":
      default:
        return {
          ...base,
          left: `calc(100% + ${offset}px)`,
          top: "50%",
          transform: "translateY(-50%)",
        };
    }
  })();

  const transformOrigin =
    placement === "top"
      ? "bottom center"
      : placement === "bottom"
        ? "top center"
        : placement === "left"
          ? "center right"
          : "center left";

  return (
    <div
      className={clsx("relative", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <div
        role="tooltip"
        aria-hidden={!open}
        style={{ ...style, transformOrigin }}
        className={clsx("tooltip", open && "tooltip--open", tooltipClassName)}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
