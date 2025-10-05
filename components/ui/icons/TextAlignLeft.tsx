import * as React from "react";

const TextAlignLeft = (props: { width: number; height: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-text-align-end-icon lucide-text-align-end"
    viewBox="0 0 24 24"
  >
    <path d="M21 5H3M21 12H9M21 19H7"></path>
  </svg>
);

export default TextAlignLeft;
