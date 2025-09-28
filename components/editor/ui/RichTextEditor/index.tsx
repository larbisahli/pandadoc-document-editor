import React, { useEffect, useMemo, useRef, useState } from "react";

/** Minimal HTML sanitizer (no libs). Allow only safe tags/attrs. */
function sanitizeHtmlUnsafe(html: string): string {
  const allowedTags = new Set([
    "B",
    "I",
    "U",
    "STRONG",
    "EM",
    "A",
    "P",
    "BR",
    "DIV",
    "SPAN",
    "H1",
    "H2",
    "UL",
    "OL",
    "LI",
  ]);
  const allowedAttrs: Record<string, Set<string>> = {
    A: new Set(["href", "target", "rel"]),
    SPAN: new Set([]),
    DIV: new Set([]),
    P: new Set([]),
    H1: new Set([]),
    H2: new Set([]),
    UL: new Set([]),
    OL: new Set([]),
    LI: new Set([]),
    B: new Set([]),
    I: new Set([]),
    U: new Set([]),
    STRONG: new Set([]),
    EM: new Set([]),
    BR: new Set([]),
  };

  const doc = new DOMParser().parseFromString(html, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
  const toRemove: Element[] = [];

  let node = walker.currentNode as Element | null;
  while (node) {
    const tag = node.tagName.toUpperCase();
    if (!allowedTags.has(tag)) {
      toRemove.push(node);
    } else {
      // strip disallowed attributes
      [...node.attributes].forEach((attr) => {
        if (!allowedAttrs[tag]?.has(attr.name)) {
          node.removeAttribute(attr.name);
        }
        // rudimentary guard: only http(s) links
        if (tag === "A" && attr.name === "href") {
          const v = node.getAttribute("href") || "";
          if (!/^https?:\/\//i.test(v)) node.removeAttribute("href");
          node.setAttribute("rel", "noopener noreferrer");
          node.setAttribute("target", "_blank");
        }
      });
      // disallow inline event handlers
      [...node.attributes].forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on"))
          node.removeAttribute(attr.name);
      });
      // disallow style (keep this simple)
      node.removeAttribute("style");
    }
    node = walker.nextNode() as Element | null;
  }
  toRemove.forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
  return doc.body.innerHTML;
}

type Props = {
  value: string; // HTML
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Type something…",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setFocused] = useState(false);

  // Keep DOM in sync when `value` changes externally
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  // Apply formatting via execCommand
  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    // ensure onChange fires with sanitized HTML
    const el = ref.current;
    if (el) onChange(sanitizeHtmlUnsafe(el.innerHTML));
  };

  const applyBlock = (block: "P" | "H1" | "H2") => {
    if (block === "P") exec("formatBlock", "P");
    if (block === "H1") exec("formatBlock", "H1");
    if (block === "H2") exec("formatBlock", "H2");
  };

  const createLink = () => {
    const url = prompt("Enter URL (https://…):")?.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) return alert("Please use http(s) links.");
    exec("createLink", url);
  };

  const onInput = () => {
    const el = ref.current;
    if (!el) return;
    onChange(sanitizeHtmlUnsafe(el.innerHTML));
  };

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html") || "";
    const text = e.clipboardData.getData("text/plain") || "";
    const safe = sanitizeHtmlUnsafe(html || text.replace(/\n/g, "<br>"));
    document.execCommand("insertHTML", false, safe);
    const el = ref.current;
    if (el) onChange(sanitizeHtmlUnsafe(el.innerHTML));
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    if (e.key.toLowerCase() === "b") {
      e.preventDefault();
      exec("bold");
    }
    if (e.key.toLowerCase() === "i") {
      e.preventDefault();
      exec("italic");
    }
    if (e.key.toLowerCase() === "u") {
      e.preventDefault();
      exec("underline");
    }
  };

  const empty = !value || value === "<br>";

  return (
    <div className={`rounded-lg border p-2 ${className}`}>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button type="button" onClick={() => exec("bold")} aria-label="Bold">
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          aria-label="Italic"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          aria-label="Underline"
        >
          <u>U</u>
        </button>
        <span className="mx-2"></span>
        <button type="button" onClick={() => applyBlock("P")}>
          Paragraph
        </button>
        <button type="button" onClick={() => applyBlock("H1")}>
          H1
        </button>
        <button type="button" onClick={() => applyBlock("H2")}>
          H2
        </button>
        <span className="mx-2"></span>
        <button type="button" onClick={() => exec("insertUnorderedList")}>
          • List
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")}>
          1. List
        </button>
        <button type="button" onClick={createLink}>
          Link
        </button>
        <span className="mx-2"></span>
        <button type="button" onClick={() => exec("undo")}>
          Undo
        </button>
        <button type="button" onClick={() => exec("redo")}>
          Redo
        </button>
        <button type="button" onClick={() => exec("removeFormat")}>
          Clear
        </button>
      </div>

      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          minHeight: 140,
          outline: "none",
          padding: 8,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />
      {!isFocused && empty && (
        <div
          style={{
            pointerEvents: "none",
            marginTop: -120,
            padding: 8,
            color: "#999",
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
