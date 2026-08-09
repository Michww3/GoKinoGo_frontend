import { types, Instance, onSnapshot } from "mobx-state-tree";
import { AuthStore } from "./AuthStore";
import { CartStore } from "./CartStore";

export const RootStore = types.model("RootStore", {
  auth: AuthStore,
  cart: CartStore,
});

const CART_STORAGE_KEY = "cart";


function loadCartSnapshot() {
  const empty = { items: [], guestEmail: null };
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return empty;

    const snapshot = JSON.parse(raw);

    if (!CartStore.is(snapshot)) return empty;

    return snapshot;
  } catch {
    return empty;
  }
}

export const rootStore = RootStore.create({
  auth: { user: null },
  cart: loadCartSnapshot(),
});

onSnapshot(rootStore.cart, (snapshot) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot));
});

export type RootStoreInstance = Instance<typeof RootStore>;