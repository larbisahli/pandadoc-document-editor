import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useClickOutside } from "../hooks/useClickOutside";

type Align = "start" | "end" | "center";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  menuId: string;
  align: Align;
  offset: number;
  close: () => void;
};

const DropdownCtx = createContext<Ctx | null>(null);
const useDropdownCtx = () => {
  const ctx = useContext(DropdownCtx);
  if (!ctx) throw new Error("Dropdown.* must be used within <Dropdown>");
  return ctx;
};

type DropdownProps = PropsWithChildren<{
  align?: Align;
  offset?: number; // px gap between trigger and panel
  className?: string;
}>;

export function Dropdown({
  children,
  align = "end",
  offset = 6,
  className = "relative inline-block",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(rootRef, close);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <DropdownCtx.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentRef,
        menuId,
        align,
        offset,
        close,
      }}
    >
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </DropdownCtx.Provider>
  );
}

type TriggerProps = PropsWithChildren<{
  asChild?: boolean; // if true, you pass your own <button>; we'll clone it
  className?: string;
  "aria-label"?: string;
}>;

Dropdown.Trigger = function Trigger({
  children,
  asChild = true,
  className,
  ...rest
}: TriggerProps) {
  const { open, setOpen, triggerRef, menuId } = useDropdownCtx();

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const common = {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle();
    },
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": menuId,
    type: "button" as const,
    className,
    ...rest,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, common);
  }

  return <button {...common}>{children}</button>;
};

type ContentProps = PropsWithChildren<{
  align?: Align;
  className?: string;
  widthClassName?: string; // e.g., "w-48"
  bottomOffset?: number;
}>;

Dropdown.Content = function Content({
  children,
  align,
  className,
  bottomOffset,
  widthClassName = "min-w-[160px]",
}: ContentProps) {
  const {
    open,
    contentRef,
    menuId,
    align: ctxAlign,
    offset,
  } = useDropdownCtx();
  const a = align ?? ctxAlign;

  if (!open) return null;

  const alignClass =
    a === "start"
      ? "left-0"
      : a === "end"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      id={menuId}
      ref={contentRef}
      role="menu"
      tabIndex={-1}
      className={[
        "absolute z-50 py-1",
        alignClass,
        widthClassName,
        "rounded-md bg-white shadow-sm focus:outline-none",
        className ?? "",
      ].join(" ")}
      style={{ marginTop: offset, bottom: bottomOffset }}
    >
      {children}
    </div>
  );
};

type ItemProps = PropsWithChildren<{
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
}>;

Dropdown.Item = function Item({
  children,
  onSelect,
  className,
  disabled,
  role = "menuitem",
}: ItemProps) {
  const { close } = useDropdownCtx();
  const handle = () => {
    if (disabled) return;
    onSelect?.();
    close();
  };
  return (
    <button
      role={role}
      type="button"
      disabled={disabled}
      onClick={handle}
      className={[
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
        disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
};

Dropdown.Separator = function Separator() {
  return <div className="my-1 h-px bg-gray-200" role="separator" />;
};
