import { createContext, useContext, type ReactNode } from "react";
import { rootStore, type RootStoreInstance } from "./RootStore";

const StoreContext = createContext<RootStoreInstance>(rootStore);

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}