import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { documentSlice } from "./features/document/documentSlice";
import { layoutSlice } from "./features/layout/layoutSlice";
import { instancesSlice } from "./features/instance/instanceSlice";
import { templatesSlice } from "./features/template/templateSlice";
import { overlaySlice } from "./features/overlay/overlaySlice";

// `combineSlices` automatically combines the reducers using
const rootReducer = combineSlices(
  documentSlice,
  layoutSlice,
  instancesSlice,
  templatesSlice,
  overlaySlice,
);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  });
}

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
