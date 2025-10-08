import React, { useEffect, useId, useRef, memo, useState } from "react";
import clsx from "clsx";
import Tooltip from "./Tooltip";

type Placement = "bottom" | "top";
type Align = "start" | "center" | "end";

export type ActionItem = {
  key: string;
  label: string;
  onSelect: () => void;
  icon: (props?: unknown) => React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  shortcut?: string;
  line?: boolean;
};

type ActionsTooltipProps = {
  active: boolean; // controlled
  actions: ActionItem[];
  className?: string;
  placement?: Placement;
  align?: Align;
  offset?: number;
};

export function ActionsTooltip({
  active,
  actions,
  className = "relative inline-block",
}: ActionsTooltipProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const [open, setOpen] = useState(false);

  // Focus first enabled item on open for keyboard nav
  useEffect(() => {
    if (!active) return;
    const first = panelRef.current?.querySelector<HTMLButtonElement>(
      'button[role="menuitem"]:not(:disabled)',
    );
    first?.focus();
  }, [active]);

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        setOpen(true);
      }, 50);
      return;
    }
    setTimeout(() => {
      setOpen(false);
    }, 10);
  }, [active]);

  return (
    <div
      id={menuId}
      role="menu"
      className={clsx(
        "absolute bg-transparent",
        "top-[-35px] left-1/2 -translate-x-1/2 -translate-y-1/2",
      )}
      style={{ zIndex: 999999 }}
    >
      <div
        ref={panelRef}
        className={clsx(
          "rounded-[2px] bg-[#414247] shadow-md outline-none",
          "will-change-opacity origin-bottom will-change-transform",
          "transition duration-200 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none h-0 w-0 translate-y-2 scale-[0.98] overflow-hidden opacity-0",
        )}
      >
        <MenuList actions={actions} />
      </div>
    </div>
  );
}

const MenuList = memo(function MenuList({
  actions,
}: {
  actions: ActionItem[];
}) {
  return (
    <div className="flex items-center justify-center p-1">
      {actions.map((a) => (
        <MenuItem key={a.key} action={a} />
      ))}
    </div>
  );
});

const MenuItem = memo(function MenuItem({ action }: { action: ActionItem }) {
  const handle = () => {
    if (action.disabled) return;
    action.onSelect();
  };

  return (
    <Tooltip
      className="flex items-center justify-center"
      content={action.label}
      placement="bottom"
    >
      <button
        type="button"
        role="menuitem"
        onClick={handle}
        disabled={action.disabled}
        className={clsx(
          "flex w-full items-center gap-2 rounded-[2px] p-1 text-left text-sm text-[#fafafa] outline-none hover:bg-gray-500/50",
          action.danger &&
            "text-[#e5e5e5] hover:bg-gray-500/40 hover:text-red-600",
        )}
      >
        <span className="shrink-0">{action?.icon()}</span>
      </button>
      {action.line && <div className="mx-1 h-[20px] w-[1px] bg-gray-400" />}
    </Tooltip>
  );
});
