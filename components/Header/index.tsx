"use client";

import {
  AlignJustify,
  Check,
  CircleQuestionMark,
  Ellipsis,
  Eye,
  FileDown,
  Folder,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Tooltip from "../ui/Tooltip";
import GithubIcon from "../ui/icons/github";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectDocTitle,
  updateDocTitle,
} from "@/lib/features/document/documentSlice";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);

  const title = useAppSelector(selectDocTitle);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  // Keep UI in sync with external store updates
  useEffect(() => {
    if (ref.current && ref.current.innerText !== title) {
      ref.current.innerText = title;
    }
  }, [title]);

  // Debounced handler
  const debouncedUpdate = useDebounceCallback((title: string) => {
    dispatch(updateDocTitle({ title }));
  }, 300);

  const handleInput = () => {
    if (ref.current) {
      debouncedUpdate(ref.current.innerText);
    }
  };

  async function exportPdf() {
    setLoading(true);
    const resp = await fetch("/api/export-pdf");
    if (!resp.ok) {
      setLoading(false);
      throw new Error("Export failed");
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agreement.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <nav className="border-primary flex h-15 items-center justify-between border-b">
      <div className="flex h-full w-full items-center">
        <div className="h-15 w-15">
          <button className="hover:bg-hover flex h-full w-full items-center justify-center">
            <AlignJustify size={20} />
          </button>
        </div>
        <div className="ml-2 flex-1">
          <div className="flex items-center">
            <div
              ref={ref}
              contentEditable
              suppressContentEditableWarning
              className="rounded-[4px] border border-transparent px-1 text-[15px] font-semibold text-gray-800 outline-none focus:border focus:border-green-500"
              onInput={handleInput}
            />
            <div className="ml-5">
              <div className="rounded-[2px] bg-[#9fa1a7] px-[4px] py-[2px] text-[9px] font-semibold text-white uppercase">
                documents
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Tooltip content="Open folder" placement="bottom">
              <button className="text-muted hover:text-green-primary flex items-center px-1">
                <Folder size={16} />
                <div className="mx-1 text-xs">All documents</div>
              </button>
            </Tooltip>
            <div className="text-muted font-sm">•</div>
            <Tooltip content="Version history" placement="bottom">
              <button className="text-muted hover:text-green-primary relative flex items-center px-1">
                <Check size={16} />
                <div className="mx-1 text-xs">Updated 2 minutes ago</div>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={exportPdf}
            className="bg-green-primary flex items-center rounded-[4px] px-3 py-[5px] text-white"
          >
            <span className="flex items-center text-sm font-medium">
              Export
            </span>
            {loading ? (
              <Loader className="ml-2 animate-spin" size={20} />
            ) : (
              <FileDown className="ml-2" size={20} />
            )}
          </button>
          <Link
            href="/pdf/print"
            target="_blank"
            className="bg-green-primary mx-2 flex items-center rounded-[4px] px-3 py-[5px] text-white"
          >
            <span className="flex items-center text-sm font-medium">
              Preview
            </span>
            <Eye className="ml-2" size={20} />
          </Link>
          <button className="hover:bg-hover text-muted ml-3 flex items-center rounded-[4px] px-1 py-[5px]">
            <Ellipsis className="rotate-90" size={20} />
          </button>
        </div>
      </div>
      <div className="bg-hover mx-3 h-[50%] w-[1px]"></div>
      <div className="flex pr-4">
        <div className="mr-5 flex text-nowrap">
          <button className="text-green-primary flex cursor-pointer items-center">
            <CircleQuestionMark size={18} className="mx-2" />
            <span className="text-sm font-semibold">Need help</span>
          </button>
        </div>
        <Link
          aria-label="GitHub repository"
          target="_blank"
          href="https://github.com/larbisahli"
        >
          <GithubIcon
            className="size-6 fill-black hover:fill-black/60"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
