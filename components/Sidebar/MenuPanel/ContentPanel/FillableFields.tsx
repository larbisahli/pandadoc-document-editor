import {
  LetterText,
  LucideProps,
  PencilLine,
  SquareCheck,
  Stamp,
} from "lucide-react";
import React from "react";
import { DragPayload } from "@/dnd/payload";
import {
  TextImagePreview,
  SignatureImagePreview,
  InitialsImagePreview,
  CheckboxImagePreview,
  StampImagePreview,
} from "./FieldPreviews";

export interface FillableFieldType {
  id: string;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  dragPayload: DragPayload;
  dragImagePreview: React.FC<unknown>;
}

export const fillableFields: FillableFieldType[] = [
  {
    id: "field-text",
    label: "Text field",
    icon: (props) => <LetterText {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-text" },
    },
    dragImagePreview: TextImagePreview,
  },
  {
    id: "field-signature",
    label: "Signature",
    icon: (props) => <PencilLine {...props} size={16} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-signature" },
    },
    dragImagePreview: SignatureImagePreview,
  },
  {
    id: "field-initials",
    label: "Initials",
    icon: (props) => <LetterText {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-initials" },
    },
    dragImagePreview: InitialsImagePreview,
  },
  {
    id: "field-checkbox",
    label: "Checkbox",
    icon: (props) => <SquareCheck {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-checkbox" },
    },
    dragImagePreview: CheckboxImagePreview,
  },
  {
    id: "field-stamp",
    label: "Stamp",
    icon: (props) => <Stamp {...props} />,
    dragPayload: {
      type: "palette.block",
      data: { templateId: "tpl-stamp" },
    },
    dragImagePreview: StampImagePreview,
  },
];
