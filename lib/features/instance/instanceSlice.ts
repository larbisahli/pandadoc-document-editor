import { DataType, InstanceId, RecipientId } from "@/interfaces/common";
import { Normalized } from "@/interfaces/document";
import { InstanceType } from "@/interfaces/instance";
import { createAppSlice } from "@/lib/createAppSlice";
import { RootState } from "@/lib/store";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import {
  addBlankPage,
  deleteBlockRefAction,
  deletePageAction,
  dropApplied,
  insertFieldCommitted,
} from "@/lib/features/editor/actions";
import { Templates } from "@/interfaces/enum";

type InstanceSliceState = Normalized<InstanceType>;

const initialState: InstanceSliceState = {
  byId: {
    inst_g3uzinxt1muh: {
      templateId: Templates.Image,
      data: {
        url: "http://localhost:3000/editor-diagram.png",
        name: "Screenshot 2025-08-08 at 02.37.10.png",
        type: "image/png",
        size: 306629,
        width: 1500,
        height: 460,
        aspectRatio: 1.47,
      },
      id: "inst_g3uzinxt1muh" as InstanceId,
    },
    inst_z0w6lgm234iq: {
      templateId: Templates.Text,
      data: {
        content:
          "This project is a demo document editor inspired by PandaDoc’s platform, built to showcase modern front-end architecture, drag-and-drop interactions, and real-time editing patterns. It is not an official PandaDoc product, but a personal project for learning and portfolio purposes.",
      },
      id: "inst_z0w6lgm234iq" as InstanceId,
    },
    inst_ie9fuca37qas: {
      templateId: Templates.Text,
      data: {
        content:
          "- Flexible document schema with nested blocks, rows, and fields\n",
      },
      id: "inst_ie9fuca37qas" as InstanceId,
    },
    inst_k3s8sgj6xx91: {
      templateId: Templates.Text,
      data: {
        content:
          "- Drag-and-drop system (custom hook + draggable wrapper) for adding and rearranging blocks",
      },
      id: "inst_k3s8sgj6xx91" as InstanceId,
    },
    inst_b5q12b803p75: {
      templateId: Templates.Text,
      data: {
        content:
          "- Edge-based hover detection with visual highlights for precise placement",
      },
      id: "inst_b5q12b803p75" as InstanceId,
    },
    inst_y00dveakfssm: {
      templateId: Templates.Text,
      data: {
        content:
          "- Undo/redo history and normalized app state for predictable updates (Coming soon)",
      },
      id: "inst_y00dveakfssm" as InstanceId,
    },
    inst_u2ptimo8qq0i: {
      templateId: Templates.Text,
      data: {
        content: "- Each field has its own recipient",
      },
      id: "inst_u2ptimo8qq0i" as InstanceId,
    },
    inst_6r6iqi7aodud: {
      templateId: Templates.Text,
      data: {
        content:
          "This project was created as part of my preparation for system design and front-end interviews at PandaDoc.",
      },
      id: "inst_6r6iqi7aodud" as InstanceId,
    },
    inst_02e4r54z6nci: {
      templateId: Templates.Text,
      data: {
        content: "The editor demonstrates:",
      },
      id: "inst_02e4r54z6nci" as InstanceId,
    },
    inst_nhftttmlcsil: {
      templateId: Templates.Text,
      data: {
        content: "- Export pdf (Coming soon)",
      },
      id: "inst_nhftttmlcsil" as InstanceId,
    },
    inst_ula95gy1j4st: {
      templateId: Templates.Signature,
      data: {
        content: "",
      },
      id: "inst_ula95gy1j4st" as InstanceId,
      recipientId: "recipient_1" as RecipientId,
    },
    inst_cghz17z8fwew: {
      id: "inst_cghz17z8fwew" as InstanceId,
      templateId: Templates.Text,
      data: {
        content: "- Rich text editor (coming soon)",
      },
    },
    inst_f1za9fxraxap: {
      id: "inst_f1za9fxraxap" as InstanceId,
      templateId: Templates.Text,
      data: {
        content: "- Functional fillable fields (coming soon)",
      },
    },
    inst_u4864bhvokcy: {
      id: "inst_u4864bhvokcy" as InstanceId,
      templateId: Templates.Date,
      data: {
        content: "",
      },
      recipientId: "recipient_1" as RecipientId,
    },
    inst_n7qobwtza7wr: {
      id: "inst_n7qobwtza7wr" as InstanceId,
      templateId: Templates.Signature,
      data: {
        content: "",
      },
      recipientId: "recipient_2" as RecipientId,
    },
    inst_bju9zfz9yv7l: {
      id: "inst_bju9zfz9yv7l" as InstanceId,
      templateId: Templates.Date,
      data: {
        content: "",
      },
      recipientId: "recipient_2" as RecipientId,
    },
  },
};

export const instancesSlice = createAppSlice({
  name: "instances",
  initialState,
  reducers: (create) => ({
    updateInstanceDataField: create.reducer(
      (
        state,
        action: PayloadAction<{
          data: DataType;
          instanceId: InstanceId;
        }>,
      ) => {
        const { data, instanceId } = action.payload;
        if (instanceId) {
          state.byId[instanceId].data = data;
        }
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(dropApplied, (state, action) => {
        const instance = action.payload.payload.data.instance;
        const instanceId = instance!.id as InstanceId;
        state.byId[instanceId] = instance as InstanceType;
      })
      .addCase(insertFieldCommitted, (state, action) => {
        const { instance } = action.payload;
        state.byId[instance.id] = instance;
      })
      .addCase(addBlankPage, (state, action) => {
        const event = action.payload;
        state.byId[event.instanceId] = {
          id: event.instanceId,
          templateId: Templates.Text,
          data: {
            content: "",
          },
        };
      })
      .addCase(deleteBlockRefAction, (state, action) => {
        const { instanceId } = action.payload;
        delete state.byId[instanceId];
      })
      .addCase(deletePageAction, (state, { payload }) => {
        const { instanceIds } = payload;
        for (const id of instanceIds) {
          delete state.byId[id];
        }
      });
  },
  selectors: {
    selectInstancesById: (state) => state.byId,
  },
});

export const { updateInstanceDataField } = instancesSlice.actions;

export const { selectInstancesById } = instancesSlice.selectors;

// Parametric selector
export const selectInstance = createSelector(
  [selectInstancesById, (_: RootState, instanceId: InstanceId) => instanceId],
  (instances, instanceId) => instances[instanceId],
);
