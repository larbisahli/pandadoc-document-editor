import { OverlayId } from "@/interfaces/common";
import { FieldKind } from "@/interfaces/enum";
import { InstanceType } from "@/interfaces/instance";
import React, { ComponentType, lazy } from "react";

export const FIELD_KINDS = [
  FieldKind.TextArea,
  FieldKind.Initials,
  FieldKind.Signature,
  FieldKind.Stamp,
  FieldKind.checkbox,
] as const;

export const isFieldKind = (v: unknown): v is FieldKind =>
  typeof v === "string" && (FIELD_KINDS as readonly string[]).includes(v);

export interface BaseFieldProps {
  overlayId: OverlayId;
  instance: InstanceType;
}

export type AnyFieldComponent = ComponentType<BaseFieldProps>;

// Fallback for unknown kinds
const UnknownField: AnyFieldComponent = ({ overlayId }) => (
  <div className="text-xs text-red-600">Unknown field: {overlayId}</div>
);

// Static or lazy component imports
const TextField = lazy(() => import("@/components/editor/fields/TextField"));

/* The registry (static map) */
const STATIC_REGISTRY: Record<FieldKind, AnyFieldComponent> = {
  [FieldKind.TextArea]: TextField,
  [FieldKind.Initials]: TextField,
  [FieldKind.Signature]: TextField,
  [FieldKind.Stamp]: TextField,
  [FieldKind.checkbox]: TextField,
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

// Under the hood calls getFieldComponent
export const FIELD_COMPONENTS = new Proxy(STATIC_REGISTRY, {
  get(_target, prop) {
    return getFieldComponent(String(prop));
  },
}) as Record<string, AnyFieldComponent>;
