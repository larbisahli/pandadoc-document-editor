"use client";

import React from "react";
import MenuHeader from "../MenuHeader";
import { contentBlocks } from "./Blocks";
import BlockTile from "./BlockTile";
import { fillableFields } from "./Fields";
import FieldTile from "./FieldTile";
import RecipientDropdown from "@/components/editor/ui/RecipientDropdown";

const ContentPanel = () => {
  return (
    <>
      <MenuHeader label="Content" />
      <div className="px-4">
        <div className="text-muted w-full pt-3 pb-2 text-xs uppercase">
          Blocks
        </div>
        <div className="grid grid-cols-2 gap-2">
          {contentBlocks.map((block) => (
            <BlockTile key={block.id} block={block} />
          ))}
        </div>
        <div className="text-muted w-full pt-4 pb-2 text-xs uppercase">
          Fillable fields for
        </div>
        <div className="mb-4">
          <RecipientDropdown />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fillableFields.map((field) => (
            <FieldTile
              key={field.id}
              field={field}
              templateId={field?.templateId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ContentPanel;
