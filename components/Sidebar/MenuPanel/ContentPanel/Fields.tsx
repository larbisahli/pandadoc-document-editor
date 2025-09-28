import {
  CalendarDays,
  CircleDot,
  LetterText,
  LucideProps,
  PanelTopOpen,
  PencilLine,
  SquareCheck,
  Stamp,
  Upload,
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
  templateId: Templates;
  handleComponentPreload: () => void;
}

export const fillableFields: FillableFieldType[] = [
  {
    id: "field-textarea",
    label: "Text field",
    icon: (props) => <LetterText {...props} />,
    dragImagePreview: TextImagePreview,
    handleComponentPreload: preloadTextAreaField,
    templateId: Templates.Textarea,
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
            width: 0,
            height: 0,
          },
          settings: {},
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
    templateId: Templates.Signature,
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
            width: 0,
            height: 0,
          },
          settings: {},
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
    templateId: Templates.Initials,
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
            width: 0,
            height: 0,
          },
          settings: {},
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
    templateId: Templates.Date,
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
            width: 0,
            height: 0,
          },
          settings: {},
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
    templateId: Templates.Checkbox,
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
            width: 0,
            height: 0,
          },
          settings: {},
        },
      },
    },
  },
  {
    id: "field-radio",
    label: "Radio buttons",
    icon: (props) => <CircleDot {...props} />,
    dragImagePreview: RadioImagePreview,
    handleComponentPreload: preloadRadioField,
    templateId: Templates.Radio,
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
            width: 0,
            height: 0,
          },
          settings: {},
        },
      },
    },
  },
  {
    id: "field-dropdown",
    label: "Dropdown",
    icon: (props) => <PanelTopOpen {...props} />,
    dragImagePreview: DropdownImagePreview,
    handleComponentPreload: preloadDropdownField,
    templateId: Templates.Dropdown,
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
            width: 0,
            height: 0,
          },
          settings: {},
        },
      },
    },
  },
  {
    id: "field-collect-files",
    label: "Collect files",
    icon: (props) => <Upload {...props} />,
    dragImagePreview: CollectFilesImagePreview,
    handleComponentPreload: preloadCollectFilesField,
    templateId: Templates.CollectFiles,
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
            width: 0,
            height: 0,
          },
          settings: {},
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
    templateId: Templates.Stamp,
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
            width: 0,
            height: 0,
          },
          settings: {},
        },
      },
    },
  },
];
