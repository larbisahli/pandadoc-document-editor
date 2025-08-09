import clsx from "clsx";
import { useTabs } from "./Tabs";

type TabProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};
export function Tab({
  value,
  children,
  disabled,
  className,
  ...rest
}: TabProps) {
  const { active, setActive, idBase } = useTabs();
  const selected = active === value;

  return (
    <li role="presentation">
      <button
        role="tab"
        id={`${idBase}-tab-${value}`}
        data-value={value}
        aria-selected={selected}
        aria-controls={`${idBase}-panel-${value}`}
        aria-disabled={disabled || undefined}
        tabIndex={selected ? 0 : -1}
        onClick={() => !disabled && setActive(value)}
        className={clsx(
          "hover:text-muted py-2 text-sm text-gray-400",
          selected &&
            "relative border-b-[2px] border-[#248567] font-semibold text-gray-700! hover:text-gray-900",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    </li>
  );
}
