import {
  CheckboxImagePreview,
  CollectFilesImagePreview,
  DateImagePreview,
  DropdownImagePreview,
  InitialsImagePreview,
  RadioImagePreview,
  SignatureImagePreview,
  StampImagePreview,
  TextImagePreview,
} from "@/components/sidebar/MenuPanel/ContentPanel/FieldPreviews";
import { defaultTemplates } from "@/core/templates";
import { InstanceId, OverlayId } from "@/interfaces/common";
import { FieldKind, Templates } from "@/interfaces/enum";
import dynamic from "next/dynamic";
import React, { ComponentType } from "react";

export const FIELD_KINDS = [
  FieldKind.TextArea,
  FieldKind.Initials,
  FieldKind.Signature,
  FieldKind.Stamp,
  FieldKind.Checkbox,
  FieldKind.Date,
  FieldKind.Dropdown,
  FieldKind.CollectFiles,
  FieldKind.Radio,
] as const;

export const isFieldKind = (v: unknown): v is FieldKind =>
  typeof v === "string" && (FIELD_KINDS as readonly string[]).includes(v);

export interface BaseFieldProps {
  instanceId: InstanceId;
  overlayId: OverlayId;
}

export type AnyFieldComponent = ComponentType<BaseFieldProps>;

// Fallback for unknown kinds
const UnknownField: AnyFieldComponent = ({ overlayId }) => (
  <div className="text-xs text-red-800">Unknown overlay: {overlayId}</div>
);

// Static or lazy component imports
const TextAreaLoader = () => import("@/components/editor/fields/TextArea");
const InitialsLoader = () => import("@/components/editor/fields/Initials");
const SignatureLoader = () => import("@/components/editor/fields/Signature");
const StampLoader = () => import("@/components/editor/fields/Stamp");
const CheckboxLoader = () => import("@/components/editor/fields/Checkbox");
const DateLoader = () => import("@/components/editor/fields/Date");
const DropdownLoader = () => import("@/components/editor/fields/Dropdown");
const CollectFilesLoader = () =>
  import("@/components/editor/fields/CollectFiles");
const RadioLoader = () => import("@/components/editor/fields/Radio");

export const TextArea = dynamic(TextAreaLoader, {
  loading: () => (
    <TextImagePreview
      width={defaultTemplates[Templates.Textarea].propsSchema?.width}
      height={defaultTemplates[Templates.Textarea].propsSchema?.height}
      isFallback
    />
  ),
});
export const Initials = dynamic(InitialsLoader, {
  loading: () => (
    <InitialsImagePreview
      width={defaultTemplates[Templates.Initials].propsSchema?.width}
      height={defaultTemplates[Templates.Initials].propsSchema?.height}
      isFallback
    />
  ),
});
export const Signature = dynamic(SignatureLoader, {
  loading: () => (
    <SignatureImagePreview
      width={defaultTemplates[Templates.Signature].propsSchema?.width}
      height={defaultTemplates[Templates.Signature].propsSchema?.height}
      isFallback
    />
  ),
});
export const Stamp = dynamic(StampLoader, {
  loading: () => (
    <StampImagePreview
      width={defaultTemplates[Templates.Stamp].propsSchema?.width}
      height={defaultTemplates[Templates.Stamp].propsSchema?.height}
      isFallback
    />
  ),
});
export const Checkbox = dynamic(CheckboxLoader, {
  loading: () => (
    <CheckboxImagePreview
      width={defaultTemplates[Templates.Checkbox].propsSchema?.width}
      height={defaultTemplates[Templates.Checkbox].propsSchema?.height}
      isFallback
    />
  ),
});
export const Date = dynamic(DateLoader, {
  loading: () => (
    <DateImagePreview
      width={defaultTemplates[Templates.Date].propsSchema?.width}
      height={defaultTemplates[Templates.Date].propsSchema?.height}
      isFallback
    />
  ),
});
export const Dropdown = dynamic(DropdownLoader, {
  loading: () => (
    <DropdownImagePreview
      width={defaultTemplates[Templates.Dropdown].propsSchema?.width}
      height={defaultTemplates[Templates.Dropdown].propsSchema?.height}
      isFallback
    />
  ),
});
export const CollectFiles = dynamic(CollectFilesLoader, {
  loading: () => (
    <CollectFilesImagePreview
      width={defaultTemplates[Templates.CollectFiles].propsSchema?.width}
      height={defaultTemplates[Templates.CollectFiles].propsSchema?.height}
      isFallback
    />
  ),
});
export const Radio = dynamic(RadioLoader, {
  loading: () => (
    <RadioImagePreview
      width={defaultTemplates[Templates.Radio].propsSchema?.width}
      height={defaultTemplates[Templates.Radio].propsSchema?.height}
      isFallback
    />
  ),
});

// warm the chunk on drag
export const preloadTextAreaField = () => TextAreaLoader();
export const preloadInitialsField = () => InitialsLoader();
export const preloadSignatureField = () => SignatureLoader();
export const preloadStampField = () => StampLoader();
export const preloadCheckboxField = () => CheckboxLoader();
export const preloadDateField = () => DateLoader();
export const preloadDropdownField = () => DropdownLoader();
export const preloadCollectFilesField = () => CollectFilesLoader();
export const preloadRadioField = () => RadioLoader();

/* The registry (static map) */
const STATIC_REGISTRY: Record<FieldKind, AnyFieldComponent> = {
  [FieldKind.TextArea]: TextArea,
  [FieldKind.Initials]: Initials,
  [FieldKind.Signature]: Signature,
  [FieldKind.Stamp]: Stamp,
  [FieldKind.Checkbox]: Checkbox,
  [FieldKind.Date]: Date,
  [FieldKind.Dropdown]: Dropdown,
  [FieldKind.CollectFiles]: CollectFiles,
  [FieldKind.Radio]: Radio,
};

/* Runtime registry (extensible) */
/** If we want to allow plugins to register fields at runtime. */
const RUNTIME_REGISTRY = new Map<FieldKind, AnyFieldComponent>();

export function registerField(kind: FieldKind, component: AnyFieldComponent) {
  RUNTIME_REGISTRY.set(kind, component);
}

// Lookup
export function getFieldComponent(kind?: string | null): AnyFieldComponent {
  if (!kind || !isFieldKind(kind)) return UnknownField;
  return RUNTIME_REGISTRY.get(kind) ?? STATIC_REGISTRY[kind] ?? UnknownField;
}

// Under the hood this calls getFieldComponent
export const FIELD_COMPONENTS = new Proxy(STATIC_REGISTRY, {
  get(_target, prop) {
    return getFieldComponent(String(prop));
  },
}) as Record<string, AnyFieldComponent>;
