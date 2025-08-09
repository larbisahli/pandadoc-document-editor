"use client";

import clsx from "clsx";
import {
  GripVertical,
  Image as ImageIcon,
  LetterText,
  SquarePlay,
} from "lucide-react";
import React, { useState } from "react";
import MenuHeader from "../MenuHeader";

const ContentPanel = () => {
  const [draggingElementId, setDraggingElementId] = useState("");

  const handleDragging = (e, id: string) => {
    setDraggingElementId(id);
    // Optional: use clone to customize the drag image
    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
    ghost.style.background = "#edebeb";
    ghost.style.border = "1px solid #cdcdcd";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    // Cleanup after a short delay
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  return (
    <>
      <MenuHeader label="Content" />
      <div className="px-4">
        <div className="text-muted w-full pt-3 pb-2 text-xs uppercase">
          Blocks
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Text */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "blocks")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-gray-200",
              draggingElementId === "blocks"
                ? "shadow-sms opacity-40"
                : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#76767629] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#1f1f1fc5]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#76767614] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#76767614] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">Text</span>
              <div className="group-hover:hidden">
                <LetterText
                  strokeWidth={1.5}
                  size={20}
                  className="text-[#313131c5]"
                />
              </div>
            </div>
          </div>
          {/* Text */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "image")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-gray-200",
              draggingElementId === "image" ? "shadow-sms opacity-40" : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#76767629] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#1f1f1fc5]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#76767614] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#76767614] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">Image</span>
              <div className="group-hover:hidden">
                <ImageIcon
                  strokeWidth={1.5}
                  size={20}
                  className="text-[#313131c5]"
                />
              </div>
            </div>
          </div>
          {/* Video */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "video")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-gray-200",
              draggingElementId === "video" ? "shadow-sms opacity-40" : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#76767629] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#1f1f1fc5]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#76767614] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#76767614] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">Video</span>
              <div className="group-hover:hidden">
                <SquarePlay size={20} className="text-[#313131c5]" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-muted w-full pt-4 pb-2 text-xs uppercase">
          Fillable fields for
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Text field */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "text-field")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-orange-200",
              draggingElementId === "text-field"
                ? "shadow-sms opacity-40"
                : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#cc5b0e29] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#cc5a0ed6]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#cc5b0e14] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#f5b18414] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">
                Text field
              </span>
              <div className="group-hover:hidden">
                <LetterText
                  strokeWidth={1.5}
                  size={20}
                  className="text-[#cc5a0ed6]"
                />
              </div>
            </div>
          </div>
          {/* Text */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "signature")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-orange-200",
              draggingElementId === "signature"
                ? "shadow-sms opacity-40"
                : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#cc5b0e29] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#cc5a0ed6]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#cc5b0e14] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#f5b18414] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">
                Signature
              </span>
              <div className="group-hover:hidden">
                <ImageIcon
                  strokeWidth={1.5}
                  size={20}
                  className="text-[#cc5a0ed6]"
                />
              </div>
            </div>
          </div>
          {/* Video */}
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "initials")}
            onDragEnd={() => setDraggingElementId("")}
            className={clsx(
              "shadow-sms relative flex h-[50px] max-w-[118px] cursor-move items-center rounded-[3px] border border-orange-200",
              draggingElementId === "initials"
                ? "shadow-sms opacity-40"
                : "group",
            )}
          >
            <div className="absolute top-0 bottom-0 left-0 hidden h-full items-center justify-center bg-[#cc5b0e29] group-hover:flex">
              <GripVertical
                strokeWidth={1.2}
                size={15}
                className="text-[#cc5a0ed6]"
              />
            </div>
            <div className="sitems-center flex h-full w-full justify-between bg-[#cc5b0e14] px-[9px] py-[10px] transition-all duration-75 group-hover:bg-[#f5b18414] group-hover:pr-[6px] group-hover:pl-[24px]">
              <span className="text-sm leading-[14px] font-medium">
                Initials
              </span>
              <div className="group-hover:hidden">
                <SquarePlay size={20} className="text-[#cc5a0ed6]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPanel;
