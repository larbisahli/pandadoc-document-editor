import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  handleDisplayPanelToggle: () => void;
}

const RecentLibraryPanel = () => {
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
    <div className="px-4">
      <div className="grid grid-cols-2 gap-2">
        {/* 1 */}
        <div
          className={clsx(
            "group relative flex max-w-[120px] cursor-move flex-col items-center",
            draggingElementId && draggingElementId !== "0000" && "opacity-40",
          )}
        >
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "0000")}
            onDragEnd={() => setDraggingElementId("")}
            className="max-w-[120px]"
          >
            <Image
              src={"/template-1.png"}
              height={120}
              width={180}
              className="rounded-[4px] border border-gray-200 shadow"
              alt="template"
            />
          </div>
          <div className="z-1 bg-white py-2 text-center leading-2">
            <span className="group-hover:text-green-primary text-xs font-semibold">
              About us: centred with video
            </span>
          </div>
        </div>
        {/* 2 */}
        <div
          className={clsx(
            "group relative flex max-w-[120px] cursor-move flex-col items-center",
            draggingElementId && draggingElementId !== "1111" && "opacity-40",
          )}
        >
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "1111")}
            onDragEnd={() => setDraggingElementId("")}
            className="relative max-w-[120px] leading-none!"
          >
            <Image
              src={"/template-1.png"}
              height={120}
              width={180}
              className="rounded-[3px] border border-gray-200 shadow"
              alt="template"
            />
          </div>
          <div className="z-1 bg-white py-2 text-center leading-2">
            <span className="group-hover:text-green-primary text-xs font-semibold">
              About us: centred with video
            </span>
          </div>
        </div>
        {/* 3 */}
        <div
          className={clsx(
            "group relative flex max-w-[120px] cursor-move flex-col items-center",
            draggingElementId && draggingElementId !== "2222" && "opacity-40",
          )}
        >
          <div
            draggable
            onDragStart={(e) => handleDragging(e, "2222")}
            onDragEnd={() => setDraggingElementId("")}
            className="max-w-[120px]"
          >
            <Image
              src={"/template-1.png"}
              height={120}
              width={180}
              className="rounded-[4px] border border-gray-200 shadow"
              alt="template"
            />
          </div>
          <div className="z-1 bg-white py-2 text-center leading-2">
            <span className="group-hover:text-green-primary text-xs font-semibold">
              About us: centred with video
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentLibraryPanel;
