import { InstanceId, OverlayId } from "@/interfaces/common";
import { FieldKind } from "@/interfaces/enum";
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

export const TextArea = dynamic(TextAreaLoader);
export const Initials = dynamic(InitialsLoader);
export const Signature = dynamic(SignatureLoader);
export const Stamp = dynamic(StampLoader);
export const Checkbox = dynamic(CheckboxLoader);
export const Date = dynamic(DateLoader);
export const Dropdown = dynamic(DropdownLoader);
export const CollectFiles = dynamic(CollectFilesLoader);
export const Radio = dynamic(RadioLoader);

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
