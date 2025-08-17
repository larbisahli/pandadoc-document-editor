export type DragPayload =
  | { type: "palette.block"; data: { templateId: string } } // new block from sidebar
  | { type: "move.node"; data: { nodeId: string } } // existing node being moved
  | { type: "asset.image"; data: { url: string; alt?: string } } // uploaded/dragged image
  | { type: "text.plain"; data: { text: string } } // text from outside (clipboard, browser)
  | { type: "field.ref"; data: { fieldId: string } }; // dynamic variable/field

export const TEXT_FIELD_PAYLOAD = {
  type: "palette.block",
  data: { templateId: "tpl-text" },
};
