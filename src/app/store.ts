import { combinedReducers } from "./features";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { isServer } from "../utils";

const storeType = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppState = ReturnType<typeof storeType.getState>;
export type AppDispatch = typeof storeType.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const createStore = (preloadedState?: AppState) => {
  return configureStore({
    reducer: combinedReducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export let store: typeof storeType | undefined;

export const initialiseStore = (preloadedState?: AppState) => {
  let _store = store ?? createStore(preloadedState);

  if (preloadedState && store) {
    _store = createStore({ ...store.getState(), ...preloadedState });
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (isServer()) return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export const useStore = (initialState?: AppState) => {
  return useMemo(() => initialiseStore(initialState), [initialState]);
};
