"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "react-draft-wysiwyg";
import {
  ContentBlock,
  ContentState,
  DraftInlineStyle,
  EditorState,
  Modifier,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";

import { Trash2 } from "lucide-react";
import { usePage } from "../canvas/context/PageContext";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  consumeCommand,
  selectNextCommandFor,
  selectTypingStyleFor,
  setActiveInstance,
} from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import {
  ensureInstanceEditorRaw,
  saveInstanceEditorRaw,
  selectInstance,
  selectInstanceEditorRaw,
} from "@/lib/features/instance/instanceSlice";
import {
  consumePendingFocus,
  selectPendingFocusInstanceId,
} from "@/lib/features/ui/uiSlice";
import { deleteBlockRef } from "@/lib/features/editor/thunks/documentThunks";
import { useClickOutside } from "../hooks/useClickOutside";
import BorderWrapper from "./BorderWrapper";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import clsx from "clsx";
import InlineControls from "./controls/InlineControls";

// RDW editor (client only) with forwarded ref so we can focus
type RDWEditorHandle = {
  focusEditor?: () => void;
  editor?: { focus?: () => void };
};
export const RDWEditor = dynamic(
  () => import("react-draft-wysiwyg").then((m) => m.Editor),
  { ssr: false },
);
// small debounce
function useDebounced<T extends (...args: any[]) => void>(fn: T, ms = 250) {
  const t = useRef<number | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (t.current) window.clearTimeout(t.current);
      t.current = window.setTimeout(() => fn(...args), ms) as unknown as number;
    },
    [fn, ms],
  );
}

// alignment classes for RDW textAlign control (RDW stores blockData: text-align)
function blockStyleFns(block: ContentBlock) {
  const a = block.getData()?.get("text-align");
  if (a === "center") return "align-center";
  if (a === "right") return "align-right";
  if (a === "justify") return "align-justify";
  return "align-left";
}

export function blockStyleFn(block: DraftInlineStyle): React.CSSProperties {
  const classes: string[] = [];

  // Headings (semantic; you style them with CSS)
  switch (block.getType()) {
    case "header-one":
      classes.push("re-h1");
      break;
    case "header-two":
      classes.push("re-h2");
      break;
    case "header-three":
      classes.push("re-h3");
      break;
    // (optional)
    case "header-four":
      classes.push("re-h4");
      break;
    case "header-five":
      classes.push("re-h5");
      break;
    case "header-six":
      classes.push("re-h6");
      break;
    case "blockquote":
      classes.push("re-quote");
      break;
    default:
      break;
  }

  // Alignment — RDW stores in block data; support multiple key names
  const data = block.getData?.();
  const align =
    data?.get("text-align") ??
    data?.get("textAlign") ??
    data?.get("textAlignment") ??
    "left";

  if (align === "center" || align === "right" || align === "justify") {
    classes.push(`re-align-${align}`);
  } else {
    classes.push("re-align-left");
  }

  return classes.join(" ");
}

function TextBlock({ nodeId, instanceId }: BaseBlockProps) {
  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const editorReadyRef = React.useRef(false);
  const pendingFocusRef = React.useRef(false);

  const editorApiRef = React.useRef<{ focus?: () => void } | null>(null);

  const editorRef = useRef<RDWEditorHandle | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const hydratedOnce = useRef(false);

  const pendingFocusId = useAppSelector(selectPendingFocusInstanceId);
  const instance = useAppSelector((s) => selectInstance(s, instanceId));
  const raw = useAppSelector((s) => selectInstanceEditorRaw(s, instanceId));

  const [editorState, setEditorState] = useState(() =>
    raw
      ? EditorState.createWithContent(convertFromRaw(raw))
      : EditorState.createEmpty(),
  );
  const [active, setActive] = useState(false);

  // call this whenever you want to focus
  const requestEditorFocus = () => {
    if (editorReadyRef.current) {
      editorApiRef.current?.focus?.();
    } else {
      pendingFocusRef.current = true; // run when ref becomes available
    }
  };

  useEffect(() => {
    if (active) {
      editorApiRef.current?.focus?.();
    }
  }, [active]);

  const onActivate = useCallback(() => {
    dispatch(setActiveInstance(instanceId));
    setActive(true);
  }, [dispatch, instanceId]);

  // Focus once when freshly dropped
  useEffect(() => {
    if (pendingFocusId !== instanceId) return;
    const raf = requestAnimationFrame(() => {
      requestEditorFocus();
      onActivate();
      dispatch(consumePendingFocus({ instanceId }));
    });
    return () => cancelAnimationFrame(raf);
  }, [pendingFocusId, instanceId, dispatch, onActivate, requestEditorFocus]);

  // Ensure initial raw once
  useEffect(() => {
    if (!instance) return;
    if (typeof raw === "undefined" || !raw) {
      const initial = convertToRaw(ContentState.createFromText(""));
      dispatch(ensureInstanceEditorRaw({ instanceId, raw: initial }));
    }
  }, [dispatch, instance, instanceId, raw]);

  // Hydrate local state once
  useEffect(() => {
    if (hydratedOnce.current) return;
    if (raw) {
      setEditorState(EditorState.createWithContent(convertFromRaw(raw)));
      hydratedOnce.current = true;
    }
  }, [raw]);

  // Save content (debounced) on changes
  const saveDebounced = useDebounced((es: EditorState) => {
    dispatch(
      saveInstanceEditorRaw({
        instanceId,
        raw: convertToRaw(es.getCurrentContent()),
      }),
    );
  }, 220);

  const handleStateChange = (next: EditorState) => {
    setEditorState(next);
    // save only on content change
    if (next.getCurrentContent() !== editorState.getCurrentContent()) {
      saveDebounced(next);
    }
  };

  // Outside click => blur selection UI, hide borders
  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  const ignoreSelectors = useMemo(
    () => [
      ".rdw-editor-toolbar", // RDW toolbar
      "[data-rich-editor-toolbar]",
      "#richEditorToolbar", // any external you might still have
      ".rdw-editor-toolbar",
      ".rdw-dropdown-wrapper",
      ".rdw-dropdown-optionwrapper",
      ".rdw-link-modal",
      ".rdw-colorpicker-modal",
      ".rdw-emoji-modal",
      ".rdw-image-modal",
    ],
    [],
  );
  useClickOutside(blockRef, onOutside, { enabled: active, ignoreSelectors });

  const handleDelete = () => {
    dispatch(deleteBlockRef({ pageId, nodeId, instanceId }));
  };

  // Built-in toolbar config (with your BlockType options)
  const toolbar = useMemo<EditorProps["toolbar"]>(
    () => ({
      options: [
        "blockType",
        "inline",
        "fontSize",
        "fontFamily",
        "colorPicker",
        "list",
        "textAlign",
        "link",
        "history",
      ],
      blockType: {
        inDropdown: true,
        options: [
          "Normal",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "Blockquote",
          "Code",
        ],
      },
      inline: {
        classname: "bg-red-400!",
        inDropdown: false,
        // Prefer "monospace" for RDW 1.x; or use "code" **and** add `code: {}`
        options: ["bold", "italic", "underline", "strikethrough", "monospace"],
        bold: {},
        italic: {},
        underline: {},
        strikethrough: {},
        monospace: {}, // or: code: {}  (if you keep "code" above)
        // (optional) className: "", dropdownClassName: ""
      },
      fontSize: {
        options: [12, 13, 14, 16, 18, 20, 24, 28, 32, 36].map(String),
      },
      fontFamily: {
        options: [
          "Inter",
          "Roboto",
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Georgia",
          "Courier New",
          "Menlo",
        ],
      },
      colorPicker: {
        colors: DOC_COLORS,
        className: "re-tooltip",
        popupClassName: "re-tooltip-dropdown",
      },
      list: { inDropdown: true },
      // textAlign: { inDropdown: true }, // RDW sets blockData{text-align}
      textAlign: {
        inDropdown: false,
        options: ["left", "center", "right", "justify"],
        left: {},
        center: {},
        right: {},
        justify: {}, // important: provide keys
      },
      history: { inDropdown: false },
    }),
    [],
  );

  console.log({ toolbar });

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if ((e as any).defaultPrevented) {
        console.warn(
          "⚠️ mousedown defaultPrevented by:",
          (e.target as HTMLElement)?.closest("*")?.className,
        );
      }
    };
    document.addEventListener("mousedown", h, true); // capture
    return () => document.removeEventListener("mousedown", h, true);
  }, []);

  function blockStyleFns(block: any) {
    switch (block.getType()) {
      case "header-one":
        return "re-h1";
      case "header-two":
        return "re-h2";
      case "header-three":
        return "re-h3";
      default:
        return "";
    }
  }

  return (
    <div
      ref={blockRef}
      onClick={() => {
        onActivate();
        requestEditorFocus();
      }}
      onFocus={onActivate}
      className="group relatives"
    >
      <BorderWrapper active={active}>
        <div className="rdw-editor-wrapper rbelative">
          {" "}
          {/* makes toolbar absolute relative to this */}
          <RDWEditor
            editorRef={(inst) => {
              editorApiRef.current = inst;
            }}
            editorState={editorState}
            onEditorStateChange={handleStateChange}
            blockStyleFn={blockStyleFn}
            toolbarClassName={clsx(
              "re-tooltip w-[800px]", // <-- scope styles
              "absolute left-1/2 -translate-x-1/2 -top-[110px]", // position like a tooltip
              "transition-opacity duration-150 z-[70] shadow-xs",
              active
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            // classes
            wrapperClassName="relative relative overflow-visible rdw-editor-wrapper"
            editorClassName={`
              rdw-editor-main re-editor re-editor-wrapper
              mb-0!
              [&_.public-DraftStyleDefault-block]:m-0!
            `}
            toolbar={toolbar}
            toolbarOnFocus={false}
            placeholder="type"
            toolbarCustomButtons={[
              <DeleteToolbarButton key="del" onDelete={handleDelete} />,
            ]}
          />
        </div>
        <style>{`
      /* base palette (scoped) */
      .re-tooltip {
        --re-border: #cbcbcb;
        --re-hover: #f2f2f2;
        --re-active: #f2f2f2;
        border: 1px solid var(--re-border);
        border-radius: 5px;
        padding: 6px 8px;
        width: 100%;
      }

      /* RDW buttons */
      .re-tooltip .rdw-option-wrapper {
        border: 1px solid var(--re-border);
        border-radius: 2px;
        height: 30px;
        min-width: 32px;
        margin: 1px !important;
      }

      .re-tooltip .rdw-option-wrapper:hover { background: var(--re-hover); }
      .re-tooltip .rdw-option-wrapper.rdw-option-active {
        background: var(--re-active) !important;
        border-color: var(--re-border) !important;
      }

      /* dropdown triggers */
      .re-tooltip .rdw-dropdown-wrapper {
        border: 1px solid var(--re-border);
        border-radius: 2px;s
        height: 30px;
        min-width: 38px;
        margin: 1px !important;
      }

      .re-tooltip .rdw-dropdown-wrapper:hover { background: var(--re-hover); }
      .re-tooltip .rdw-dropdown-carettoclose,

      /* dropdown menu */
      .re-tooltip .rdw-dropdown-optionwrapper {
        border: 1px solid var(--re-border);
        border-radius: 2px;
        z-index: 800000;
        top: 5px;
      }
      .re-tooltip .rdw-dropdownoption-default {
        padding: 6px;
      }
        .re-tooltip .rdw-dropdownoption-default {
         border-bottom: 1px solid var(--re-hover);
        }
      .re-tooltip .rdw-dropdownoption-default:hover { background: var(--re-hover); }
      .re-tooltip .rdw-dropdownoption-active { background: var(--re-active); }

      /* color picker modal */
      .re-tooltip .rdw-colorpicker-modal {
        border: 1px solid var(--re-border);
        border-radius: 5px;
      }

      .re-tooltip .rdw-colorpicker-option { border-radius: 1px; height: 30px; width; 30px; box-shadow: none !important; }
      .re-tooltip .rdw-colorpicker-option span { border-radius: 100%; }
      .re-tooltip .rdw-colorpicker-option:hover { outline: 2px solid var(--re-focus); outline-offset: 2px; }

      /* pick whatever “big” means for your theme: */
      .re-h1 { font-size: 2rem; line-height: 2.5rem; }   /* Tailwind-ish: text-2xl */
      .re-h2 { font-size: 1.5rem; line-height: 2rem; }   /* text-xl */
      .re-h3 { font-size: 1.25rem; line-height: 1.75rem; }/* text-lg */

      .re-align-left    { text-align: left; }
        .re-align-center  { text-align: center !important; }
        .re-align-right   { text-align: right; }
        .re-align-justify { text-align: justify; }
    `}</style>
      </BorderWrapper>
    </div>
  );
}

export function DeleteToolbarButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      title="Delete block"
      aria-label="Delete block"
      className="rdw-option-wrapper" // RDW style
      onMouseDown={(e) => e.preventDefault()} // keep selection/focus
      onClick={onDelete}
    >
      <Trash2 size={16} />
    </button>
  );
}

export const DOC_COLORS: string[] = [
  // neutrals (text-friendly)
  "#000000",
  "#111827",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#F3F4F6",
  "#FFFFFF",

  // red
  "#DC2626",
  "#F87171",
  "#FECACA",
  // orange
  "#EA580C",
  "#FB923C",
  "#FED7AA",
  // yellow / amber (mostly for highlights)
  "#CA8A04",
  "#FACC15",
  "#FEF08A",
  // green
  "#16A34A",
  "#4ADE80",
  "#BBF7D0",
  // teal
  "#0D9488",
  "#2DD4BF",
  "#99F6E4",
  // cyan / sky
  "#0891B2",
  "#22D3EE",
  "#A5F3FC",
  // blue
  "#2563EB",
  "#60A5FA",
  "#BFDBFE",
  // indigo
  "#4F46E5",
  "#818CF8",
  "#C7D2FE",
  // purple
  "#7C3AED",
  "#A78BFA",
  "#DDD6FE",
  // pink
  "#DB2777",
  "#F472B6",
  "#FBCFE8",
  // rose
  "#E11D48",
  "#FB7185",
  "#FECDD3",
  // brownish (stone)
  "#44403C",
  "#78716C",
  "#E7E5E4",
];

export default memo(TextBlock);
