import { RecipientId } from "@/interfaces/common";
import { createAppSlice } from "@/lib/createAppSlice";
import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { RecipientType } from "@/interfaces/recipient";
import { RecipientRoles } from "@/interfaces/enum";
import { RootState } from "@/lib/store";

interface RecipientsState {
  byId: Record<RecipientId, RecipientType>;
  allIds: RecipientId[];
  selectedId?: RecipientId; // <-- currently active recipient
}

const initialState: RecipientsState = {
  byId: {
    ["recipient_1" as RecipientId]: {
      id: "recipient_1" as RecipientId,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@gmail.com",
      color: "#FFE8E0",
      role: RecipientRoles.Signer,
    },
    ["recipient_2" as RecipientId]: {
      id: "recipient_2" as RecipientId,
      firstName: "Amelia",
      lastName: "Novak",
      email: "amelia.novak@example.com",
      color: "#E0F7F1",
      role: RecipientRoles.Signer,
    },
    ["recipient_3" as RecipientId]: {
      id: "recipient_3" as RecipientId,
      firstName: "Lucas",
      lastName: "Richter",
      email: "lucas.richter@example.com",
      color: "#FFF8E0",
      role: RecipientRoles.Signer,
    },
    ["recipient_4" as RecipientId]: {
      id: "recipient_4" as RecipientId,
      firstName: "Ethan",
      lastName: "Kowalski",
      email: "ethan.kowalski@example.com",
      color: "#E8F0FF",
      role: RecipientRoles.Signer,
    },
  },
  allIds: [
    "recipient_1",
    "recipient_2",
    "recipient_3",
    "recipient_4",
  ] as RecipientId[],
  selectedId: "recipient_1" as RecipientId,
};

export const RecipientSlice = createAppSlice({
  name: "recipients",
  initialState,
  reducers: {
    upsertMany(state, { payload }: PayloadAction<RecipientType[]>) {
      for (const r of payload) {
        if (!state.byId[r.id]) state.allIds.push(r.id);
        state.byId[r.id] = r;
      }
    },
    selectRecipient(
      state,
      { payload }: PayloadAction<RecipientId | undefined>,
    ) {
      state.selectedId = payload;
    },
  },
});

export const { upsertMany, selectRecipient } = RecipientSlice.actions;

export const selectRecipients = (state: RootState) => state.recipients;

export const selectRecipientsById = createSelector(
  selectRecipients,
  (r) => r.byId,
);

const selectRecipientIds = createSelector(selectRecipients, (r) => r.allIds);

export const selectActiveRecipientId = createSelector(
  selectRecipients,
  (r) => r.selectedId,
);

export const selectRecipientList = createSelector(
  [selectRecipientIds, selectRecipientsById],
  (ids, byId) => ids.map((id) => byId[id]).filter(Boolean) as RecipientType[],
);

export const selectActiveRecipient = createSelector(
  [selectActiveRecipientId, selectRecipientsById],
  (id, byId) => (id ? byId[id] : undefined),
);
