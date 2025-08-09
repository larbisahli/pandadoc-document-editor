import type { CustomSvgProps } from "@/interfaces";

const VariablesIcon = ({ width, height, className }: CustomSvgProps) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4h20v16H2V4zm2 2v12h16V6H4zm2 2h4v2H8v4h2v2H6V8zm12 8V8h-4v2h2v4h-2v2h4z"
    ></path>
  </svg>
);

export default VariablesIcon;
