import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";

export const ProtectedRoute = observer(function ProtectedRoute({ children }: { children: ReactNode }) {
  const { auth } = useStore();

  if (!auth.isInitialized) {
    return null;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});