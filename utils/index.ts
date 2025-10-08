import { UnixMs } from "@/interfaces/instance";

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @param value - The value to clamp.
 * @param maxAllowed - The minimum allowed value.
 * @param minAllowed - The maximum allowed value.
 * @returns The clamped value.
 */
export const clamp = (value: number, maxAllowed: number, minAllowed: number) =>
  Math.max(maxAllowed, Math.min(minAllowed, value));

/**
 * Check if a given DataTransfer object contains a specific type.
 * This function loops directly over the DOMStringList, avoiding allocations.
 * It is optimal for performance-critical code.
 *
 * @param e - The drag event (React.SyntheticEvent wrapping DragEvent).
 * @param type - The MIME type or custom identifier to check.
 * @returns true if the type exists, false otherwise.
 */
export function hasTransferType(e: React.DragEvent, type: string): boolean {
  const types = e.dataTransfer.types;
  for (let i = 0; i < types.length; i++) {
    if (types[i] === type) return true;
  }
  return false;
}

export const nowUnixMs = (): UnixMs => Date.now() as UnixMs;

export const FOCUS_FRESH_WINDOW_MS = 1500 as const;

export const isFreshSince = (
  addedAt: UnixMs | undefined,
  windowMs: number = FOCUS_FRESH_WINDOW_MS,
  now: UnixMs = nowUnixMs(),
): boolean => {
  if (!addedAt) return false;
  return now - addedAt <= windowMs;
};
