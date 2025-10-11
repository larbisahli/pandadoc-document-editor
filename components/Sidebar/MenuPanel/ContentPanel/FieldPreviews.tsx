import {
  CalendarDays,
  ChevronDown,
  PencilLine,
  Stamp,
  Upload,
} from "lucide-react";
import React from "react";

export const TextImagePreview = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="h-full w-full bg-white p-1 opacity-70">Enter value</div>
  </div>
);

export const SignatureImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <PencilLine size={18} className="mr-2" />
      Signature
    </div>
  </div>
);

export const InitialsImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-center bg-white font-medium text-gray-800 opacity-70">
      Initials
    </div>
  </div>
);

export const CheckboxImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 flex items-center justify-center rounded-[2px] border border-gray-50 bg-white! p-1"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="h-full w-full border border-gray-900 bg-white"></div>
  </div>
);

export const DateImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[1px] border border-gray-50"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-between bg-white text-gray-800 opacity-70">
      <span className="text-xs">Select date</span>
      <CalendarDays className="h-5 w-5" />
    </div>
  </div>
);

export const StampImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-center bg-white text-sm font-semibold text-gray-800 opacity-70">
      <Stamp size={18} className="mr-2" />
      Stamp
    </div>
  </div>
);

export const DropdownImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-between bg-white text-sm text-gray-800 opacity-70">
      <span className="px-1">Please select...</span>
      <ChevronDown size={18} className="mr-2" />
    </div>
  </div>
);

export const CollectFilesImagePreview = ({
  width,
  height,
  isFallback = false,
}: {
  width: number;
  height: number;
  isFallback?: boolean;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full items-center justify-center bg-white text-sm text-gray-800 opacity-70">
      <Upload size={18} className="mr-2" />
      <span>Click to upload file</span>
    </div>
  </div>
);

export const RadioImagePreview = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <div
    className="ghost pointer-events-none absolute inset-0 rounded-[2px]"
    style={{
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      opacity: 0.001, // must be in DOM and near-zero opacity
      width,
      height,
    }}
  >
    <div className="flex h-full w-full flex-col items-center justify-center bg-white text-sm text-gray-800 opacity-70">
      <div className="my-1 flex items-center justify-center">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border border-gray-900 bg-white">
          <div className="h-[20px] w-[20px] rounded-full border"></div>
        </div>
        <span className="mx-1 font-normal">Option 1</span>
      </div>
      <div className="my-1 flex items-center justify-center">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm border border-gray-900 bg-white">
          <div className="h-[20px] w-[20px] rounded-full border"></div>
        </div>
        <span className="mx-1 font-normal">Option 2</span>
      </div>
    </div>
  </div>
);
