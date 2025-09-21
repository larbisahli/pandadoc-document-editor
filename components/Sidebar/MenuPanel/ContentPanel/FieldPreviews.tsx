import { CalendarDays, PencilLine, Stamp } from "lucide-react";
import React from "react";

export const TextImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[120px] w-[200px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
    }}
  >
    <div className="h-[120px] w-[200px] bg-white p-1 opacity-70">
      Enter value
    </div>
  </div>
);

export const SignatureImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[70px] w-[200px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[70px] w-[200px] items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <PencilLine size={18} className="mr-2" />
      Signature
    </div>
  </div>
);

export const InitialsImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[110px] w-[110px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[110px] w-[110px] items-center justify-center bg-white font-medium text-gray-800 opacity-70">
      Initials
    </div>
  </div>
);

export const CheckboxImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 flex h-[22px] w-[22px] items-center justify-center rounded-[2px] border border-gray-50 bg-white"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="h-[15px] w-[15px] border border-gray-900 bg-white"></div>
  </div>
);

export const DateImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 flex h-[26px] w-[170px] items-center justify-between rounded-[2px] border border-gray-50 bg-white p-1"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <span className="text-xs text-gray-500">Select date</span>
    <CalendarDays className="h-5 w-5 text-gray-500" />
  </div>
);

export const StampImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[140px] w-[140px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[140px] w-[140px] items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);

export const DropdownImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[140px] w-[140px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[140px] w-[140px] items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);

export const CollectFilesImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[140px] w-[140px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[140px] w-[140px] items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);

export const RadioImagePreview = () => (
  <div
    className="ghost pointer-events-none absolute inset-0 h-[140px] w-[140px] rounded-[2px]"
    style={{
      transform: "scale(0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001,
    }}
  >
    <div className="flex h-[140px] w-[140px] items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);
