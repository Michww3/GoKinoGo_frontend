import { types, Instance } from "mobx-state-tree";
import { AuthStore } from "./AuthStore";
import { CartStore } from "./CartStore";

export const RootStore = types.model("RootStore", {
  auth: AuthStore,
  cart: CartStore,
});

export const rootStore = RootStore.create({
  auth: { user: null },
  cart: { items: [] },
});

export type RootStoreInstance = Instance<typeof RootStore>;