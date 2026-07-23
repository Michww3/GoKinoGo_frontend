import { types, Instance } from "mobx-state-tree";
import { AuthStore } from "./AuthStore";

export const RootStore = types.model("RootStore", {
  auth: AuthStore,
});

export const rootStore = RootStore.create({
  auth: { user: null },
});

export type RootStoreInstance = Instance<typeof RootStore>;