import { AuthApi } from "@/api/auth";
import { tokenStorage } from "@/api/client";
import { flow, Instance, types } from "mobx-state-tree";

const User = types.model("User", {
  id: types.number,
  name: types.string,
  userName: types.string,
  email: types.string,
  role: types.string,
});

export const AuthStore = types
  .model("AuthStore", {
    user: types.maybeNull(User),
    isInitialized: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get isAuthenticated() {
      return self.user !== null;
    },
  }))
  .actions((self) => ({
    login: flow(function* (email: string, password: string) {
      const res = yield AuthApi.login({ email, password });
      tokenStorage.set(res.token);
      self.user = res.user;
    }),
    register: flow(function* (payload: { name: string; userName: string; email: string; password: string }) {
      const res = yield AuthApi.register(payload);
      tokenStorage.set(res.token);
      self.user = res.user;
    }),
    logout() {
      tokenStorage.clear();
      self.user = null;
    },
    loadCurrentUser: flow(function* () {
      const token = tokenStorage.get();

      if (!token) {
        self.isInitialized = true;
        return;
      }

      try {
        const user = yield AuthApi.me();
        self.user = user;
      } catch {
        tokenStorage.clear();
        self.user = null;
      } finally {
        self.isInitialized = true;
      }
    }),
  }));

export type AuthStoreInstance = Instance<typeof AuthStore>;