import { memo, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";

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
    <div className="group relative">
      <BorderWrapper active={active}>
        <div className="relative">
          <div
            contentEditable={true}
            onFocus={handleFocusChange}
            onBlur={handleFocusChange}
            onInput={handleInput}
            className={clsx("w-full outline-none", !active && "cursor-pointer")}
          />
        </div>
      </BorderWrapper>
    </div>
  );
}

export default memo(TextBlock);
