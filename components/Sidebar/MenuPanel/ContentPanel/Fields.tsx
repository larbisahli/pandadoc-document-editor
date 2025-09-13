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
import { Templates, TemplateTypes } from "@/interfaces/enum";
import {
  preloadCheckboxField,
  preloadInitialsField,
  preloadSignatureField,
  preloadStampField,
  preloadTextAreaField,
} from "@/components/editor/canvas/overlays/FieldRegistry";
import { DropPayload } from "@/interfaces/dnd";

export interface FillableFieldType {
  id: string;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  dragPayload: DropPayload;
  dragImagePreview: React.FC<unknown>;
  handleComponentPreload: () => void;
}

export const fillableFields: FillableFieldType[] = [
  {
    id: "field-textarea",
    label: "Text field",
    icon: (props) => <LetterText {...props} />,
    dragImagePreview: TextImagePreview,
    handleComponentPreload: preloadTextAreaField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Textarea,
          data: {
            content: "",
          },
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 214,
            height: 106,
            // TODO add minW and minH here
          },
        },
      },
    },
  },
  {
    id: "field-signature",
    label: "Signature",
    icon: (props) => <PencilLine {...props} size={16} />,
    dragImagePreview: SignatureImagePreview,
    handleComponentPreload: preloadSignatureField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Signature,
          data: {
            content: "",
          },
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 200,
            height: 80,
          },
        },
      },
    },
  },
  {
    id: "field-initials",
    label: "Initials",
    icon: (props) => <LetterText {...props} />,
    dragImagePreview: InitialsImagePreview,
    handleComponentPreload: preloadInitialsField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Initials,
          data: {
            content: "",
          },
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 110,
            height: 110,
          },
        },
      },
    },
  },
  {
    id: "field-checkbox",
    label: "Checkbox",
    icon: (props) => <SquareCheck {...props} />,
    dragImagePreview: CheckboxImagePreview,
    handleComponentPreload: preloadCheckboxField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Checkbox,
          data: {
            content: "",
          },
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 25,
            height: 25,
          },
        },
      },
    },
  },
  {
    id: "field-stamp",
    label: "Stamp",
    icon: (props) => <Stamp {...props} />,
    dragImagePreview: StampImagePreview,
    handleComponentPreload: preloadStampField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Stamp,
          data: {
            content: "",
          },
        },
        overlay: {
          position: {
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            width: 140,
            height: 140,
          },
        },
      },
    },
  },
];
