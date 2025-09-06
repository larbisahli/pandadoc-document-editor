import {
  LetterText,
  LucideProps,
  PencilLine,
  SquareCheck,
  Stamp,
} from "lucide-react";
import React from "react";
import {
  TextImagePreview,
  SignatureImagePreview,
  InitialsImagePreview,
  CheckboxImagePreview,
  StampImagePreview,
} from "./FieldPreviews";
import { DragPayload } from "@/interfaces/dnd";
import { FieldKind, Templates, TemplateTypes } from "@/interfaces/enum";

export interface FillableFieldType {
  id: string;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  dragPayload: DragPayload;
  dragImagePreview: React.FC<unknown>;
}

export const fillableFields: FillableFieldType[] = [
  {
    id: "field-textarea",
    label: "Text field",
    icon: (props) => <LetterText {...props} />,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          data: {
            content: "",
          },
        },
        template: {
          id: Templates.Textarea,
          type: TemplateTypes.Field,
          kind: FieldKind.TextArea,
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 214,
            height: 106,
          },
        },
      },
    },
    dragImagePreview: TextImagePreview,
  },
  {
    id: "field-signature",
    label: "Signature",
    icon: (props) => <PencilLine {...props} size={16} />,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: { templateId: "tpl-signature" },
    },
    dragImagePreview: SignatureImagePreview,
  },
  {
    id: "field-initials",
    label: "Initials",
    icon: (props) => <LetterText {...props} />,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: { templateId: "tpl-initials" },
    },
    dragImagePreview: InitialsImagePreview,
  },
  {
    id: "field-checkbox",
    label: "Checkbox",
    icon: (props) => <SquareCheck {...props} />,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: { templateId: "tpl-checkbox" },
    },
    dragImagePreview: CheckboxImagePreview,
  },
  {
    id: "field-stamp",
    label: "Stamp",
    icon: (props) => <Stamp {...props} />,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: { templateId: "tpl-stamp" },
    },
    dragImagePreview: StampImagePreview,
  },
];
