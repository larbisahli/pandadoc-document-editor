import * as React from "react";

const TextAlignJustify = (props: { width: number; height: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-text-align-justify-icon lucide-text-align-justify"
    viewBox="0 0 24 24"
  >
    <path d="M3 5h18M3 12h18M3 19h18"></path>
  </svg>
);

export default TextAlignJustify;
