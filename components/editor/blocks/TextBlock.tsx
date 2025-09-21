import { memo, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import clsx from "clsx";

function TextBlock({ instance }: BaseBlockProps) {
  const [active, setActive] = useState(false);

  const handleFocusChange = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.type === "focus") {
      console.log("Div focused:", e.currentTarget.innerText);
      setActive(true);
    } else {
      console.log("Div unfocused:", e.currentTarget.innerText);
      setActive(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    console.log("Content changed:", e.currentTarget.innerText);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div
          contentEditable={true}
          onFocus={handleFocusChange}
          onBlur={handleFocusChange}
          onInput={handleInput}
          className="w-full outline-none"
        />
      </div>
      <div
        className={clsx(
          "dropzone-active pointer-events-none absolute inset-[-7] rounded-[2px]",
          active && "border-[#248567]! opacity-35!",
        )}
      ></div>
    </div>
  );
}

export default memo(TextBlock);
