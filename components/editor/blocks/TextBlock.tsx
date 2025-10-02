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

/* ========== RDW Editor (client-only, forwarded ref) ========== */
type RDWEditorHandle = {
  focusEditor?: () => void;
  editor?: { focus?: () => void };
};

const RDWEditor = dynamic(
  async () => {
    const mod = await import("react-draft-wysiwyg");
    const Inner = mod.Editor;
    const ReactF = (await import("react")).forwardRef<
      RDWEditorHandle,
      EditorProps
    >((props, ref) => <Inner ref={ref as any} {...props} />);
    ReactF.displayName = "RDWEditorForward";
    return ReactF;
  },
  { ssr: false },
);

/* ========== Inline style keys & mapping ========== */
const FONT_FAMILY_PREFIX = "FONTFAM_";
const FONT_SIZE_PREFIX = "FONTSIZE_";
const COLOR_PREFIX = "COLOR_"; // COLOR_rrggbb
const BGCOLOR_PREFIX = "BGCOLOR_"; // BGCOLOR_rrggbb

const famKey = (fam: string) => FONT_FAMILY_PREFIX + encodeURIComponent(fam);
const sizeKey = (px: number) => `${FONT_SIZE_PREFIX}${px}`;
const hexToKey = (hex: string) => hex.replace("#", "").toLowerCase();

function customStyleFn(styleSet: DraftInlineStyle): React.CSSProperties {
  const css: React.CSSProperties = {};
  styleSet.forEach((s: string) => {
    if (s.startsWith(FONT_FAMILY_PREFIX)) {
      css.fontFamily = decodeURIComponent(s.slice(FONT_FAMILY_PREFIX.length));
    } else if (s.startsWith(FONT_SIZE_PREFIX)) {
      const px = Number(s.slice(FONT_SIZE_PREFIX.length));
      if (Number.isFinite(px)) css.fontSize = px;
    } else if (s.startsWith(COLOR_PREFIX)) {
      css.color = "#" + s.slice(COLOR_PREFIX.length);
    } else if (s.startsWith(BGCOLOR_PREFIX)) {
      css.backgroundColor = "#" + s.slice(BGCOLOR_PREFIX.length);
    }
  });
  return css;
}

/* ========== Block alignment ========== */
function setAlignment(
  state: EditorState,
  align: "left" | "center" | "right" | "justify",
) {
  const content = state.getCurrentContent();
  const sel = state.getSelection();
  const block = content.getBlockForKey(sel.getStartKey());
  const data = block.getData().set("text-align", align);
  const nextContent = Modifier.setBlockData(content, sel, data);
  return EditorState.push(state, nextContent, "change-block-data");
}
function blockStyleFn(block: ContentBlock) {
  const a = block.getData()?.get("text-align");
  if (a === "center") return "align-center";
  if (a === "right") return "align-right";
  if (a === "justify") return "align-justify";
  return "align-left";
}

/* ========== small utils ========== */
function useDebounced<T extends (...args: any[]) => void>(fn: T, ms = 250) {
  const tRef = useRef<number | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (tRef.current) window.clearTimeout(tRef.current);
      tRef.current = window.setTimeout(
        () => fn(...args),
        ms,
      ) as unknown as number;
    },
    [fn, ms],
  );
}
const safeFocus = (ref: React.RefObject<RDWEditorHandle>) => {
  try {
    ref.current?.focusEditor?.();
    ref.current?.editor?.focus?.();
  } catch {}
};

/* ========== helpers to modify inline styles (no immutable import needed) ========== */
const INLINE_KEYS = [
  "BOLD",
  "ITALIC",
  "UNDERLINE",
  "STRIKETHROUGH",
  "CODE",
] as const;
type InlineKey = (typeof INLINE_KEYS)[number];

const Helpers = {
  getAllKeysWithPrefix(state: EditorState, prefix: string) {
    const keys = new Set<string>();
    state
      .getCurrentContent()
      .getBlockMap()
      .forEach((block) => {
        block.getCharacterList().forEach((ch) => {
          ch.getStyle().forEach((s: string) => {
            if (s.startsWith(prefix)) keys.add(s);
          });
        });
      });
    return keys;
  },
  removeKeysInSelection(state: EditorState, keys: Iterable<string>) {
    const sel = state.getSelection();
    let content = state.getCurrentContent();
    for (const k of keys) content = Modifier.removeInlineStyle(content, sel, k);
    return EditorState.push(state, content, "change-inline-style");
  },
  /** remove all keys with a prefix from the override set (caret) */
  removeFromOverrideByPrefix(override: DraftInlineStyle, prefix: string) {
    let out = override as any;
    override.forEach((s: string) => {
      if (s.startsWith(prefix)) out = out.remove(s);
    });
    return out as DraftInlineStyle;
  },
  /** remove specific keys (BOLD, etc.) from override */
  removeSpecificFromOverride(override: DraftInlineStyle, keys: InlineKey[]) {
    let out = override as any;
    keys.forEach((k) => {
      if ((override as any).has?.(k)) out = out.remove(k);
    });
    return out as DraftInlineStyle;
  },
  /** Add keys into override */
  addIntoOverride(override: DraftInlineStyle, keys: string[]) {
    let out = override as any;
    keys.forEach((k) => {
      out = out.add(k);
    });
    return out as DraftInlineStyle;
  },
  /** signature string to avoid infinite loops without immutable.equals */
  sig(override: DraftInlineStyle) {
    const arr: string[] = [];
    (override as any).forEach?.((k: string) => arr.push(k));
    if (arr.length === 0) {
      // fallback via iterator
      for (const k of override as any as Iterable<string>) arr.push(k);
    }
    return arr.sort().join("|");
  },
};

/* ==================== Component ==================== */

function TextBlock({ nodeId, instanceId }: BaseBlockProps) {
  const { pageId } = usePage();
  const dispatch = useAppDispatch();

  const blockRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RDWEditorHandle | null>(null);
  const hydratedOnce = useRef(false);

  const pendingInstanceId = useAppSelector(selectPendingFocusInstanceId);
  const command = useAppSelector((s) => selectNextCommandFor(s, instanceId));
  const instance = useAppSelector((s) => selectInstance(s, instanceId));
  const raw = useAppSelector((s) => selectInstanceEditorRaw(s, instanceId));
  const typing = useAppSelector((s) => selectTypingStyleFor(s, instanceId)); // persistent caret style

  const [editorState, setEditorState] = useState(() =>
    raw
      ? EditorState.createWithContent(convertFromRaw(raw))
      : EditorState.createEmpty(),
  );
  const [active, setActive] = useState(false);

  const handleBlockFocus = useCallback(() => {
    dispatch(setActiveInstance(instanceId));
    setActive(true);
  }, [dispatch, instanceId]);

  /* Focus once when this block was just dropped */
  useEffect(() => {
    if (pendingInstanceId !== instanceId) return;
    const id = requestAnimationFrame(() => {
      safeFocus(editorRef);
      handleBlockFocus();
      dispatch(consumePendingFocus({ instanceId }));
    });
    return () => cancelAnimationFrame(id);
  }, [pendingInstanceId, instanceId, dispatch, handleBlockFocus]);

  /* Ensure initial raw once */
  useEffect(() => {
    if (!instance) return;
    if (typeof raw === "undefined") {
      const initialRaw = convertToRaw(ContentState.createFromText(""));
      dispatch(ensureInstanceEditorRaw({ instanceId, raw: initialRaw }));
    }
  }, [dispatch, instance, instanceId, raw]);

  /* Hydrate local EditorState once from raw */
  useEffect(() => {
    if (hydratedOnce.current) return;
    if (raw) {
      setEditorState(EditorState.createWithContent(convertFromRaw(raw)));
      hydratedOnce.current = true;
    }
  }, [raw]);

  /* Persist content (debounced) */
  const saveDebounced = useDebounced((state: EditorState) => {
    dispatch(
      saveInstanceEditorRaw({
        instanceId,
        raw: convertToRaw(state.getCurrentContent()),
      }),
    );
  }, 220);

  useEffect(() => {
    saveDebounced(editorState);
  }, [editorState, saveDebounced]);

  const buildDesiredOverrideFromCurrent = useCallback(
    (current: DraftInlineStyle) => {
      console.log({ typing });
      // start from current override, strip our keys, then add desired
      let ov = current;
      ov = Helpers.removeFromOverrideByPrefix(ov, FONT_FAMILY_PREFIX);
      ov = Helpers.removeFromOverrideByPrefix(ov, FONT_SIZE_PREFIX);
      ov = Helpers.removeFromOverrideByPrefix(ov, COLOR_PREFIX);
      ov = Helpers.removeFromOverrideByPrefix(ov, BGCOLOR_PREFIX);
      ov = Helpers.removeSpecificFromOverride(ov, [
        "BOLD",
        "ITALIC",
        "UNDERLINE",
        "STRIKETHROUGH",
        "CODE",
      ]);

      const add: string[] = [];
      if (typing.family) add.push(famKey(typing.family));
      if (typing.size) add.push(sizeKey(typing.size));
      if (typing.color) add.push(`${COLOR_PREFIX}${hexToKey(typing.color)}`);
      if (typing.bg) add.push(`${BGCOLOR_PREFIX}${hexToKey(typing.bg)}`);
      if (typing.inline?.BOLD) add.push("BOLD");
      if (typing.inline?.ITALIC) add.push("ITALIC");
      if (typing.inline?.UNDERLINE) add.push("UNDERLINE");
      if (typing.inline?.STRIKETHROUGH) add.push("STRIKETHROUGH");
      if (typing.inline?.CODE) add.push("CODE");

      return Helpers.addIntoOverride(ov, add);
    },
    [typing],
  );

  /* Keep caret inline override always in sync with persistent typing style — NO immutable import */
  useEffect(() => {
    // return
    setEditorState((prev) => {
      const sel = prev.getSelection();
      // only enforce on caret (optional: && sel.getHasFocus())
      if (!sel.isCollapsed()) return prev;

      const current = prev.getCurrentInlineStyle(); // current override set
      const desired = buildDesiredOverrideFromCurrent(current);

      // compare current vs desired; only set when different
      if (Helpers.sig(current) !== Helpers.sig(desired)) {
        return EditorState.setInlineStyleOverride(prev, desired);
      }
      return prev;
    });
    // depend on typingSig ONLY (or selector with shallowEqual)
  }, [typing, buildDesiredOverrideFromCurrent]);

  /* Handle external commands (selection application + focus) */
  useEffect(() => {
    if (!command) return;

    const rawPayload = command.payload as unknown;

    setEditorState((prev) => {
      const sel = prev.getSelection();
      let next = prev;

      const applyInline = (prefix: string, key: string) => {
        if (sel.isCollapsed()) {
          // caret only: change override (future typing)
          let override = prev.getCurrentInlineStyle();
          override = Helpers.removeFromOverrideByPrefix(override, prefix);
          const updated = Helpers.addIntoOverride(override, [key]);
          if (Helpers.sig(updated) !== Helpers.sig(override)) {
            return EditorState.setInlineStyleOverride(prev, updated);
          }
          return prev;
        }
        // selection: clear then apply
        const toRemove = Helpers.getAllKeysWithPrefix(prev, prefix);
        const cleared = Helpers.removeKeysInSelection(prev, toRemove);
        return RichUtils.toggleInlineStyle(cleared, key);
      };

      console.log(">>>>>OOOO", command.type);

      switch (command.type) {
        case "FOCUS": {
          safeFocus(editorRef);
          return prev;
        }

        // case "TOGGLE_INLINE": {
        //   const style =
        //     typeof rawPayload === "string"
        //       ? rawPayload
        //       : (rawPayload && typeof rawPayload === "object" ? (rawPayload as any).style : "");
        //   next = RichUtils.toggleInlineStyle(prev, String(style ?? ""));
        //   break;
        // }

        case "SET_FONT_FAMILY": {
          const fam =
            typeof rawPayload === "string"
              ? rawPayload
              : rawPayload && typeof rawPayload === "object"
                ? (rawPayload as any).family
                : "";
          if (!fam) return prev;
          next = applyInline(FONT_FAMILY_PREFIX, famKey(String(fam)));
          break;
        }

        case "SET_FONT_SIZE": {
          const n =
            typeof rawPayload === "number"
              ? rawPayload
              : Number(
                  rawPayload && typeof rawPayload === "object"
                    ? (rawPayload as any).size
                    : 0,
                );
          if (!Number.isFinite(n) || n <= 0) return prev;
          next = applyInline(FONT_SIZE_PREFIX, sizeKey(n));
          break;
        }

        case "SET_COLOR": {
          const hex =
            typeof rawPayload === "string"
              ? rawPayload
              : rawPayload && typeof rawPayload === "object"
                ? (rawPayload as any).hex
                : "";
          if (!hex) return prev;
          next = applyInline(
            COLOR_PREFIX,
            `${COLOR_PREFIX}${hexToKey(String(hex))}`,
          );
          break;
        }

        case "SET_BG_COLOR": {
          const hex =
            typeof rawPayload === "string"
              ? rawPayload
              : rawPayload && typeof rawPayload === "object"
                ? (rawPayload as any).hex
                : "";
          if (!hex) return prev;
          next = applyInline(
            BGCOLOR_PREFIX,
            `${BGCOLOR_PREFIX}${hexToKey(String(hex))}`,
          );
          break;
        }

        case "SET_ALIGNMENT": {
          const align = (
            rawPayload && typeof rawPayload === "object"
              ? (rawPayload as any).align
              : "left"
          ) as "left" | "center" | "right" | "justify";
          next = setAlignment(prev, align);
          break;
        }

        case "CLEAR_INLINE": {
          const all = new Set<string>([
            ...Helpers.getAllKeysWithPrefix(prev, FONT_FAMILY_PREFIX),
            ...Helpers.getAllKeysWithPrefix(prev, FONT_SIZE_PREFIX),
            ...Helpers.getAllKeysWithPrefix(prev, COLOR_PREFIX),
            ...Helpers.getAllKeysWithPrefix(prev, BGCOLOR_PREFIX),
          ]);
          next = Helpers.removeKeysInSelection(prev, all);
          // also clear override (caret) for our prefixes + inline keys
          let ov = prev.getCurrentInlineStyle();
          ov = Helpers.removeFromOverrideByPrefix(ov, FONT_FAMILY_PREFIX);
          ov = Helpers.removeFromOverrideByPrefix(ov, FONT_SIZE_PREFIX);
          ov = Helpers.removeFromOverrideByPrefix(ov, COLOR_PREFIX);
          ov = Helpers.removeFromOverrideByPrefix(ov, BGCOLOR_PREFIX);
          ov = Helpers.removeSpecificFromOverride(ov, [...INLINE_KEYS]);
          next = EditorState.setInlineStyleOverride(next, ov);
          break;
        }

        case "SPLIT_BLOCK": {
          const content = prev.getCurrentContent();
          const selNow = prev.getSelection();
          const nextContent = Modifier.splitBlock(content, selNow);
          next = EditorState.push(prev, nextContent, "split-block");
          next = EditorState.forceSelection(
            next,
            nextContent.getSelectionAfter(),
          );
          break;
        }

        case "TOGGLE_BLOCK": {
          const type =
            typeof rawPayload === "string"
              ? rawPayload
              : rawPayload && typeof rawPayload === "object"
                ? (rawPayload as any).type
                : "";
          next = RichUtils.toggleBlockType(prev, String(type ?? ""));
          break;
        }

        default:
          return prev;
      }

      console.log(next);

      return next;
    });

    // ack + refocus so typing continues with the override
    dispatch(consumeCommand({ id: command.id }));
    if (command.type !== "FOCUS") {
      const raf = requestAnimationFrame(() => safeFocus(editorRef));
      return () => cancelAnimationFrame(raf);
    }
  }, [command, command?.id, dispatch]);

  /* Delete block */
  const handleDelete = () => {
    dispatch(deleteBlockRef({ pageId, nodeId, instanceId }));
  };

  /* Outside clicks (ignore global toolbar via selectors) */
  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  const ignoreSelectors = useMemo(
    () => [
      "[data-rich-editor-toolbar]",
      "#richEditorToolbar",
      ".rdw-editor-toolbar",
    ],
    [],
  );

  useClickOutside(blockRef, onOutside, { enabled: active, ignoreSelectors });

  return (
    <div
      ref={blockRef}
      onClick={handleBlockFocus}
      onFocus={handleBlockFocus}
      className="group relative"
    >
      <BorderWrapper active={active}>
        <RDWEditor
          ref={editorRef}
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarHidden
          customStyleFn={customStyleFn}
          blockStyleFn={blockStyleFn}
          wrapperClassName="m-0"
          editorClassName="px-0 py-1 min-h-[24px]"
          toolbarOnFocus
          stripPastedStyles={false}
          placeholder=""
        />
        <style>{`
          .align-left { text-align: left; }
          .align-center { text-align: center; }
          .align-right { text-align: right; }
          .align-justify { text-align: justify; }
        `}</style>
      </BorderWrapper>

      <ActionsTooltip
        active={active}
        actions={[
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 size={18} />,
            danger: true,
            onSelect: handleDelete,
          },
        ]}
      />
    </div>
  );
}

export default memo(TextBlock);
