import * as React from "react";

const TextAlignCenter = (props: { width: number; height: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-text-align-center-icon lucide-text-align-center"
    viewBox="0 0 24 24"
  >
    <path d="M21 5H3M17 12H7M19 19H5"></path>
  </svg>
);

export default TextAlignCenter;
