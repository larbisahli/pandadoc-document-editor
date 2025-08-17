import { PencilLine, Stamp } from "lucide-react";
import React from "react";

export const TextImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[120px] w-[200px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
    }}
  >
    <div className="h-[120px] w-[200px] rounded-md bg-white p-1 opacity-70">
      Enter value
    </div>
  </div>
);

export const SignatureImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[70px] w-[200px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[70px] w-[200px] items-center justify-center rounded-md bg-white text-sm font-semibold text-gray-800 opacity-70">
      <PencilLine size={18} className="mr-2" />
      Signature
    </div>
  </div>
);

export const InitialsImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[110px] w-[110px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[110px] w-[110px] items-center justify-center rounded-md bg-white font-medium text-gray-800 opacity-70">
      Initials
    </div>
  </div>
);

export const CheckboxImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 flex h-[22px] w-[22px] items-center justify-center border border-gray-50 bg-white"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="h-[15px] w-[15px] border border-gray-900 bg-white"></div>
  </div>
);

export const StampImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[140px] w-[140px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[140px] w-[140px] items-center justify-center rounded-md bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);
