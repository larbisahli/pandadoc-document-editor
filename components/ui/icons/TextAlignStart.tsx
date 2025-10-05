import * as React from "react";

const TextAlignStart = (props: { width: number; height: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-text-align-start-icon lucide-text-align-start"
    viewBox="0 0 24 24"
  >
    <path d="M21 5H3M15 12H3M17 19H3"></path>
  </svg>
);

export default TextAlignStart;
