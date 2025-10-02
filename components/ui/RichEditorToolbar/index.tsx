// components/RichEditorToolbar.tsx
"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  issueCommand,
  selectActiveInstanceId,
  selectTypingStyleFor,
  setTypingStyle,
} from "@/lib/features/rich-editor-ui/richEditorUiSlice";
import { useAppSelector } from "@/lib/hooks";
import { InstanceId } from "@/interfaces/common";

const FONTS = [
  "Inter",
  "Roboto",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Menlo",
];
const SIZES = [12, 13, 14, 16, 18, 20, 24, 28, 32, 36];

export default function RichEditorToolbar() {
  const dispatch = useDispatch();
  const activeId = useSelector(selectActiveInstanceId) as InstanceId;

  const typing = useAppSelector((s) => selectTypingStyleFor(s, activeId)); // persistent caret style

  console.log("!!!!!!!=!=!=!=!", typing);

  const [family, setFamily] = useState<string>("Arial");
  const [size, setSize] = useState<number | "">(14);
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffff00");

  if (!activeId) return null;

  const send = (type: string, payload?: Record<string, unknown>) =>
    dispatch(issueCommand({ target: activeId, type, payload }));

  const setStyle = (patch: any) =>
    dispatch(setTypingStyle({ instanceId: activeId, patch }));

  const btn = (active = false) =>
    clsx(
      "text-sm py-1 px-2 hover:bg-gray-100! rounded",
      active ? "bg-gray-200" : "bg-white",
    );

  return (
    <div
      id="richEditorToolbar"
      data-rich-editor-toolbar
      className="z-20 flex items-center gap-1 text-sm"
      role="toolbar"
      aria-label="Rich editor controls"
    >
      {/* Family */}
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <select
        className="h-6 max-w-[120px]"
        value={family}
        onChange={(e) => {
          const v = e.target.value;
          setFamily(v);
          setStyle({ family: v }); // persist for future typing
          send("SET_FONT_FAMILY", { family: v }); // apply to selection now
          setTimeout(() => send("FOCUS"), 0);
        }}
      >
        <option value="">Font</option>
        {FONTS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Size */}
      <select
        className="h-6 max-w-[70px]"
        value={size === "" ? "" : String(size)}
        onChange={(e) => {
          const n = Number(e.target.value);
          setSize(Number.isFinite(n) ? n : "");
          if (Number.isFinite(n)) {
            setStyle({ size: n });
            send("SET_FONT_SIZE", { size: n });
            setTimeout(() => send("FOCUS"), 0);
          }
        }}
      >
        <option value="">Size</option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      <div className="mx-[1px] h-[25px] w-[1px] bg-gray-300" />

      {/* Inline toggles (also persist for caret) */}
      <button
        className={btn(typing?.inline?.BOLD)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ inline: { BOLD: !typing?.inline?.BOLD } });
          send("TOGGLE_INLINE", { style: "BOLD" });
        }}
      >
        <b>B</b>
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(typing?.inline?.ITALIC)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ inline: { ITALIC: !typing?.inline?.ITALIC } });
          send("TOGGLE_INLINE", { style: "ITALIC" });
        }}
      >
        <i>I</i>
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(typing?.inline?.UNDERLINE)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ inline: { UNDERLINE: !typing?.inline?.UNDERLINE } });
          send("TOGGLE_INLINE", { style: "UNDERLINE" });
        }}
      >
        <u>U</u>
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(typing?.inline?.STRIKETHROUGH)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({
            inline: { STRIKETHROUGH: !typing?.inline?.STRIKETHROUGH },
          });
          send("TOGGLE_INLINE", { style: "STRIKETHROUGH" });
        }}
      >
        <span style={{ textDecoration: "line-through" }}>S</span>
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      {/* Colors */}
      <label className="text-xs text-gray-500">Text</label>
      <input
        type="color"
        className="h-6 w-4 rounded-full"
        value={fg}
        onBlur={() => setTimeout(() => send("FOCUS"), 0)}
        onChange={(e) => {
          const hex = e.target.value;
          setFg(hex);
          setStyle({ color: hex });
          send("SET_COLOR", { hex });
        }}
      />

      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <label className="text-xs text-gray-500">Highlight</label>
      <input
        type="color"
        onBlur={() => setTimeout(() => send("FOCUS"), 0)}
        className="h-6 w-4 rounded-full"
        value={bg}
        onChange={(e) => {
          const hex = e.target.value;
          setBg(hex);
          setStyle({ bg: hex });
          send("SET_BG_COLOR", { hex });
        }}
      />

      {/* Align */}
      <div className="mx-1 h-4 w-px bg-gray-200" />
      <button
        className={btn(typing?.align === "left")}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ align: "left" });
          send("SET_ALIGNMENT", { align: "left" });
        }}
      >
        ⟸
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(typing?.align === "center")}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ align: "center" });
          send("SET_ALIGNMENT", { align: "center" });
        }}
      >
        ≡
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      <button
        className={btn(typing?.align === "right")}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setStyle({ align: "right" });
          send("SET_ALIGNMENT", { align: "right" });
        }}
      >
        ⟹
      </button>
      <div className="mx-[2px] h-[25px] w-[1px] bg-gray-300" />
      {/* Clear */}
      {/* <div className="w-px h-4 bg-gray-200 mx-1" /> */}
      {/* <button className={btn()} onMouseDown={e=>e.preventDefault()} onClick={() => { setStyle({ family: undefined, size: undefined, color: undefined, bg: undefined, inline: {}, }); send("CLEAR_INLINE", { scopes: ["all"] }); }}>Clear</button> */}
    </div>
  );
}
