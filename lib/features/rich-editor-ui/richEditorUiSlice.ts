// store/richEditorUiSlice.ts (add to your existing slice)
import { RootState } from "@/lib/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InstanceId = string;

export type TypingStyle = {
  family?: string; // e.g. "Inter"
  size?: number; // e.g. 16
  color?: string; // "#rrggbb"
  bg?: string; // "#rrggbb"
  inline?: {
    BOLD?: boolean;
    ITALIC?: boolean;
    UNDERLINE?: boolean;
    STRIKETHROUGH?: boolean;
    CODE?: boolean;
  };
  align?: "left" | "center" | "right" | "justify";
};

type State = {
  activeInstanceId: InstanceId | null;
  queue: Array<{
    id: string;
    target: InstanceId | "active";
    type: string;
    payload?: unknown;
  }>;
  typingByInstance: Record<InstanceId, TypingStyle>;
};

const initialState: State = {
  activeInstanceId: null,
  queue: [],
  typingByInstance: {},
};

export const editorUiSlice = createSlice({
  name: "richEditorUi",
  initialState,
  reducers: {
    setActiveInstance(state, a: PayloadAction<InstanceId | null>) {
      state.activeInstanceId = a.payload;
    },
    issueCommand(
      state,
      a: PayloadAction<{
        target: InstanceId | "active";
        type: string;
        payload?: unknown;
      }>,
    ) {
      state.queue.push({ id: crypto.randomUUID(), ...a.payload });
      if (state.queue.length > 100)
        state.queue.splice(0, state.queue.length - 100);
    },
    consumeCommand(state, a: PayloadAction<{ id: string }>) {
      const i = state.queue.findIndex((q) => q.id === a.payload.id);
      if (i !== -1) state.queue.splice(i, 1);
    },

    // NEW: persist typing style per instance (partial merge)
    setTypingStyle(
      state,
      a: PayloadAction<{ instanceId: InstanceId; patch: Partial<TypingStyle> }>,
    ) {
      const { instanceId, patch } = a.payload;
      state.typingByInstance[instanceId] = {
        ...state.typingByInstance[instanceId],
        ...patch,
        inline: {
          ...(state.typingByInstance[instanceId]?.inline ?? {}),
          ...(patch.inline ?? {}),
        },
      };
    },
  },
});

export const {
  setActiveInstance,
  issueCommand,
  consumeCommand,
  setTypingStyle, // <— export
} = editorUiSlice.actions;

export const selectActiveInstanceId = (s: RootState) =>
  s.richEditorUi.activeInstanceId as InstanceId | null;
export const selectNextCommandFor = (s: RootState, id: InstanceId) => {
  const { queue, activeInstanceId } = s.richEditorUi as State;
  return queue.find(
    (c) =>
      c.target === id || (c.target === "active" && activeInstanceId === id),
  );
};

// Keep the same instance
export const EMPTY_TYPING_STYLE: Readonly<TypingStyle> = Object.freeze({});

export const selectTypingStyleFor = createSelector(
  [
    (s: RootState) => s.richEditorUi.typingByInstance,
    (_: RootState, id: InstanceId) => id,
  ],
  (map, id): TypingStyle => map?.[id] ?? EMPTY_TYPING_STYLE,
);
