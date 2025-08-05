import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
}) => {
  const baseClasses =
    "absolute z-[100] pointer-events-none whitespace-nowrap rounded-[2px] bg-gray-800 px-2 py-1 text-xs text-white shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100";

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 translate-y-2 group-hover:translate-y-0",
    bottom:
      "top-full left-1/2 -translate-x-1/2 mt-2 -translate-y-2 group-hover:translate-y-0",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 translate-x-2 group-hover:translate-x-0",
    right:
      "left-full top-1/2 -translate-y-1/2 ml-2 -translate-x-2 group-hover:translate-x-0",
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        role="tooltip"
        className={`${baseClasses} ${placementClasses[placement]}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
