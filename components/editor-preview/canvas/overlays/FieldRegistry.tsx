import Checkbox from "@/components/editor-preview/fields/Checkbox";
import CollectFiles from "@/components/editor-preview/fields/CollectFiles";
import Dropdown from "@/components/editor-preview/fields/Dropdown";
import Initials from "@/components/editor-preview/fields/Initials";
import Radio from "@/components/editor-preview/fields/Radio";
import Signature from "@/components/editor-preview/fields/Signature";
import Stamp from "@/components/editor-preview/fields/Stamp";
import Date from "@/components/editor-preview/fields/Date";
import TextArea from "@/components/editor-preview/fields/TextArea";
import { InstanceId, OverlayId } from "@/interfaces/common";
import { FieldKind } from "@/interfaces/enum";
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
