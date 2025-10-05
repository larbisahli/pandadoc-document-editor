import {
  selectActiveInstanceId,
  selectFormats,
  makeSelectHighlightColor,
} from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import clsx from "clsx";
import { FONTS, HL_COLORS, SIZES } from "./data";
import { InstanceId } from "@/interfaces/common";
import {
  redo,
  setAlign,
  setColor,
  setFontFamily,
  setFontSize,
  setHeading,
  setLink,
  toggleBold,
  toggleBullet,
  toggleHighlight,
  toggleItalic,
  toggleOrdered,
  toggleUnderline,
  undo,
  unsetLink,
} from "@/lib/features/thunks/richEditorThunk";
import {
  Bold,
  EllipsisVertical,
  Eraser,
  Highlighter,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo,
  Underline,
  Undo,
  Unlink,
} from "lucide-react";
import TextAlignLeft from "../icons/TextAlignLeft";
import TextAlignStart from "../icons/TextAlignStart";
import TextAlignCenter from "../icons/TextAlignCenter";
import TextAlignJustify from "../icons/TextAlignJustify";
import { Dropdown } from "@/components/editor/ui/DropdownMenu";
import { useRef } from "react";

const RichEditorToolbar = () => {
  const dispatch = useAppDispatch();

  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const targetId = useAppSelector(selectActiveInstanceId) as InstanceId;
  const formats = useAppSelector((store) => selectFormats(store, targetId));
  const selectedHighlight = useAppSelector((store) =>
    makeSelectHighlightColor(store, targetId),
  );

  if (!targetId) return null;

  const isOn = (k: keyof typeof formats, v?: unknown) =>
    v === undefined ? Boolean(formats[k]) : formats[k] === v;

  const setLinkFlow = async () => {
    const href = window.prompt("Enter URL", formats.linkHref || "https://");
    if (!href) return;
    dispatch(setLink({ editorId: targetId, href }));
  };

  const handleHighlightChange = (value: string) => {
    if (value === "clear") {
      dispatch(toggleHighlight({ editorId: targetId, color: "" }));
    } else if (value === "default") {
      dispatch(toggleHighlight({ editorId: targetId }));
    } else {
      dispatch(toggleHighlight({ editorId: targetId, color: value }));
    }
  };

  const handleFontChange = (value: string) => {
    dispatch(setFontSize({ editorId: targetId, size: value || null }));
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch(
      setFontFamily({
        editorId: targetId,
        family: value || null,
      }),
    );
  };

  const handleHeadingChange = (value: number | false) => {
    dispatch(
      setHeading({
        editorId: targetId,
        level: value ? (Number(value) as 1 | 2 | 3 | 4 | 5) : false,
      }),
    );
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColor({ editorId: targetId, color: e.target.value }));
  };

  const btn = (active = false) =>
    clsx(
      "text-sm py-1 px-2 m-[3px] hover:bg-gray-100! rounded text-gray-600",
      active ? "bg-gray-200 text-black!" : "bg-white",
    );

  const getFontLabel = (value?: string): string => {
    const FONT_LABELS = Object.fromEntries(
      FONTS.map((f) => [f.value, f.label]),
    );
    return FONT_LABELS[value ?? ""] ?? "Arial";
  };

  const openPicker = () => colorInputRef.current?.click();

  return (
    <div
      id="richEditorToolbar"
      data-rich-editor-toolbar
      className="flex flex-1 items-center"
    >
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      {/* Headings */}
      <Dropdown align="center">
        <Dropdown.Trigger
          asChild
          className="relative h-full w-full min-w-[90px] px-2 py-1 text-[13px] whitespace-nowrap text-gray-500"
        >
          {formats.heading ? `Heading ${formats.heading}` : "Normal text"}
        </Dropdown.Trigger>
        <Dropdown.Content widthClassName="w-[180px]">
          <Dropdown.Item
            className={clsx(
              "group text-gray-600",
              !formats.heading && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(false)}
          >
            Normal text
          </Dropdown.Item>
          <Dropdown.Item
            className={clsx(
              "group text-[2rem] text-green-600",
              formats.heading === 1 && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(1)}
          >
            Heading 1
          </Dropdown.Item>
          <Dropdown.Item
            className={clsx(
              "group text-[1.75rem] text-green-600",
              formats.heading === 2 && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(2)}
          >
            Heading 2
          </Dropdown.Item>
          <Dropdown.Item
            className={clsx(
              "group text-[1.5rem] text-green-600",
              formats.heading === 3 && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(3)}
          >
            Heading 3
          </Dropdown.Item>
          <Dropdown.Item
            className={clsx(
              "group text-[1.25rem] text-green-600",
              formats.heading === 4 && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(4)}
          >
            Heading 4
          </Dropdown.Item>
          <Dropdown.Item
            className={clsx(
              "group text-[1.1rem] text-green-600",
              formats.heading === 5 && "bg-gray-200",
            )}
            onSelect={() => handleHeadingChange(5)}
          >
            Heading 5
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Font family */}
      <Dropdown align="center">
        <Dropdown.Trigger
          asChild
          className="relative h-full w-full px-2 py-1 text-[13px] whitespace-nowrap text-gray-500"
        >
          {getFontLabel(formats.fontFamily || "Arial")}
        </Dropdown.Trigger>
        <Dropdown.Content widthClassName="w-[180px]">
          {FONTS.map((ff) => (
            <Dropdown.Item
              key={ff.value}
              className={clsx(
                "group text-gray-600",
                formats.fontFamily === ff.value && "bg-gray-200",
              )}
              onSelect={() => handleFontFamilyChange(ff.value)}
            >
              {ff.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Font size */}
      <Dropdown align="center">
        <Dropdown.Trigger
          asChild
          className="relative h-full w-full px-2 py-1 text-[13px] text-gray-500"
        >
          {formats.fontSize || "16px"}
        </Dropdown.Trigger>
        <Dropdown.Content widthClassName="w-[70px]">
          {SIZES.map((sz) => (
            <Dropdown.Item
              key={sz}
              className={clsx(
                "group justify-center text-gray-600",
                formats.fontSize === sz && "bg-gray-200",
              )}
              onSelect={() => handleFontChange(sz)}
            >
              {sz}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Inline styles */}
      <button
        className={btn(isOn("bold"))}
        aria-pressed={isOn("bold")}
        onClick={() => dispatch(toggleBold({ editorId: targetId }))}
      >
        <Bold strokeWidth={2.5} size={15} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("italic"))}
        aria-pressed={isOn("italic")}
        onClick={() => dispatch(toggleItalic({ editorId: targetId }))}
      >
        <Italic strokeWidth={2.5} size={15} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("underline"))}
        aria-pressed={isOn("underline")}
        onClick={() => dispatch(toggleUnderline({ editorId: targetId }))}
      >
        <Underline strokeWidth={2.5} size={15} />
      </button>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Highlight */}
      <Dropdown align="center">
        <Dropdown.Trigger
          asChild
          className="relative h-full w-full p-1 text-gray-600"
        >
          <Highlighter size={20} strokeWidth={2} />
          <div
            className="absolute right-0 -bottom-[3px] left-0 h-[3px]"
            style={{ background: selectedHighlight || "transparent" }}
          />
        </Dropdown.Trigger>
        <Dropdown.Content widthClassName="w-[100px]">
          {HL_COLORS.map((c) => (
            <Dropdown.Item
              key={c.value}
              className={clsx(
                "group text-gray-600",
                selectedHighlight === c.value && "bg-gray-200",
              )}
              onSelect={() => handleHighlightChange(c.value)}
            >
              <div
                className="h-5 w-5 rounded-full shadow-sm"
                style={{ background: c.value || "transparent" }}
              />
              {c.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Text color */}
      <div className="relative">
        <input
          ref={colorInputRef}
          type="color"
          value={formats.color || "#000000"}
          onChange={handleColorChange}
          className="pointer-events-none absolute top-[40px] h-[1px] w-[1px]"
          tabIndex={-1}
          aria-hidden
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // keep editor focused
          onClick={openPicker}
          aria-label="Text color"
          title="Text color"
          className="relative"
        >
          <div className="px-2">A</div>
          <div
            className="absolute -bottom-[3px] h-[3px] w-full"
            style={{ background: formats.color || "#000" }}
          />
        </button>
      </div>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Lists */}
      <button
        className={btn(isOn("list", "ordered"))}
        aria-pressed={isOn("list", "ordered")}
        onClick={() => dispatch(toggleOrdered({ editorId: targetId }))}
      >
        <ListOrdered size={20} strokeWidth={2} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("list", "bullet"))}
        aria-pressed={isOn("list", "bullet")}
        onClick={() => dispatch(toggleBullet({ editorId: targetId }))}
      >
        <List size={20} strokeWidth={2} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      {/* Align */}
      <button
        className={btn(isOn("align", "left"))}
        aria-pressed={isOn("align", "left")}
        onClick={() =>
          dispatch(setAlign({ editorId: targetId, value: "left" }))
        }
      >
        <TextAlignStart width={18} height={18} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("align", "center"))}
        aria-pressed={isOn("align", "center")}
        onClick={() =>
          dispatch(setAlign({ editorId: targetId, value: "center" }))
        }
      >
        <TextAlignCenter width={18} height={18} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("align", "right"))}
        aria-pressed={isOn("align", "right")}
        onClick={() =>
          dispatch(setAlign({ editorId: targetId, value: "right" }))
        }
      >
        <TextAlignLeft width={18} height={18} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(isOn("align", "justify"))}
        aria-pressed={isOn("align", "justify")}
        onClick={() =>
          dispatch(setAlign({ editorId: targetId, value: "justify" }))
        }
      >
        <TextAlignJustify width={18} height={18} />
      </button>
      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />
      <Dropdown align="center">
        <Dropdown.Trigger
          asChild
          className="relative h-full w-full px-2 py-1 text-[13px] whitespace-nowrap text-gray-500"
        >
          <EllipsisVertical size={16} strokeWidth={2} />
        </Dropdown.Trigger>
        <Dropdown.Content widthClassName="w-[180px]">
          <Dropdown.Item
            className="group text-gray-600"
            onSelect={() =>
              dispatch(setColor({ editorId: targetId, color: null }))
            }
          >
            <Eraser className="text-gray-500" size={18} strokeWidth={2} />
            Clear color
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item
            className="group text-gray-600"
            aria-pressed={Boolean(formats.linkHref)}
            onSelect={setLinkFlow}
          >
            <Link className="text-gray-500" size={18} strokeWidth={2} />
            Link
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item
            disabled={!formats.linkHref}
            className="group text-gray-600"
            onSelect={() => dispatch(unsetLink({ editorId: targetId }))}
          >
            <Unlink className="text-gray-500" size={18} strokeWidth={2} />
            Unlink
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item
            className="group text-gray-600"
            onSelect={() => dispatch(undo({ editorId: targetId }))}
          >
            <Undo className="text-gray-500" size={18} strokeWidth={2} />
            Undo
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item
            className="group text-gray-600"
            onSelect={() => dispatch(redo({ editorId: targetId }))}
          >
            <Redo className="text-gray-500" size={18} strokeWidth={2} />
            Redo
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
};

export default RichEditorToolbar;
