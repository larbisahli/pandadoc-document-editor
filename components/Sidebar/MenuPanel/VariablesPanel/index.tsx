import { ExternalLink, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MenuHeader from "../MenuHeader";

const VariablesPanel = () => {
  return (
    <>
      <MenuHeader label="Variables" />
      <div className="flex flex-col items-center justify-center px-4">
        <div className="my-2 text-gray-600">
          <p className="mb-2 text-[13px] leading-[18px]">
            Using a variable helps save time.
          </p>
          <p className="mb-2 text-[13px] leading-[18px]">
            Simply add it once, then let it populate throughout your document or
            template automatically.
          </p>
          <p className="text-[13px] leading-[18px]">
            A variable is enclosed within brackets such as{" "}
            <strong className="text-gray-800">[YourVariable.Name]</strong> — you
            can choose from our list or create your own.
          </p>
        </div>
        <div className="relative h-[200px] w-[200px]">
          <Image alt="gif" fill={true} src="/771baa4d.gif" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link
            target="_blank"
            href={"https://support.pandadoc.com/en/articles/9714599-variables"}
          >
            <button className="flex w-[130px] items-center rounded-[2px] bg-[#edf5f3] p-[6px] px-[12px] text-[#248567] hover:bg-[#e3edec]">
              <span className="mr-2 text-sm font-semibold">Learn more</span>
              <ExternalLink size={18} />
            </button>
          </Link>
          <button className="text-muted mt-2 flex w-[130px] items-center justify-center rounded-[2px] p-[6px] px-[12px] hover:bg-[#edecec]">
            <span className="mr-2 text-sm font-semibold">Hide</span>
          </button>
        </div>
      </div>
      <div className="my-2 border-t border-gray-200 px-4 py-4">
        <div className="text-muted uppercase">
          <button className="bg-green-primary flex w-full items-center justify-center rounded-sm px-4 py-2 text-white">
            <Plus size={24} className="pr-2" />
            <span className="text-[15px] font-semibold">
              Add custom variable
            </span>
          </button>
        </div>
        <div className="text-muted mt-4 text-sm uppercase">
          40 variables shown
        </div>
      </div>
    </>
  );
};

export default VariablesPanel;
