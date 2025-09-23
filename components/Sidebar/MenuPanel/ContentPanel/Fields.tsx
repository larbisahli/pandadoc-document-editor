import {
  CalendarDays,
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
  DateImagePreview,
  DropdownImagePreview,
  CollectFilesImagePreview,
  RadioImagePreview,
} from "./FieldPreviews";
import { Templates, TemplateTypes } from "@/interfaces/enum";
import {
  preloadCheckboxField,
  preloadCollectFilesField,
  preloadDateField,
  preloadDropdownField,
  preloadInitialsField,
  preloadRadioField,
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
  dragImagePreview: React.FC<{ width: number; height: number }>;
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
            width: 171,
            height: 93,
            // TODO add minW and minH here
          },
          settings: {
            resizeWidth: true,
            resizeHeight: true,
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
            width: 129,
            height: 62,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: true,
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
            width: 100,
            height: 68,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: true,
          },
        },
      },
    },
  },
  {
    id: "field-date",
    label: "Date",
    icon: (props) => <CalendarDays {...props} />,
    dragImagePreview: DateImagePreview,
    handleComponentPreload: preloadDateField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Date,
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
            width: 149,
            height: 26,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: false,
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
          settings: {
            resizeWidth: true,
            resizeHeight: true,
          },
        },
      },
    },
  },
  {
    id: "field-radio",
    label: "Radio buttons",
    icon: (props) => <Stamp {...props} />,
    dragImagePreview: RadioImagePreview,
    handleComponentPreload: preloadRadioField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Radio,
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
            width: 117,
            height: 90,
          },
          settings: {
            resizeWidth: false,
            resizeHeight: false,
          },
        },
      },
    },
  },
  {
    id: "field-dropdown",
    label: "Dropdown",
    icon: (props) => <Stamp {...props} />,
    dragImagePreview: DropdownImagePreview,
    handleComponentPreload: preloadDropdownField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.Dropdown,
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
            width: 160,
            height: 26,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: false,
          },
        },
      },
    },
  },
  {
    id: "field-collect-files",
    label: "Collect files",
    icon: (props) => <Stamp {...props} />,
    dragImagePreview: CollectFilesImagePreview,
    handleComponentPreload: preloadCollectFilesField,
    dragPayload: {
      kind: TemplateTypes.Field,
      data: {
        instance: {
          templateId: Templates.CollectFiles,
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
            width: 180,
            height: 28,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: false,
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
            width: 150,
            height: 150,
          },
          settings: {
            resizeWidth: true,
            resizeHeight: true,
          },
        },
      },
    },
  },
];
