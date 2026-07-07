import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMe } from "../hooks/use-auth";
import { useAuthStore } from "../lib/auth-store";
import type { UserProfile } from "../types/auth";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storedUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { data: fetchedUser, isLoading } = useMe();

  // Sync fetched user to store
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser as any);
    }
  }, [fetchedUser, setUser]);

  // On mount, if we have stored user but aren't authed, clear
  useEffect(() => {
    if (!isAuthenticated) {
      useAuthStore.getState().logout();
    }
  }, [isAuthenticated]);

  const value: AuthContextValue = {
    user: (fetchedUser || storedUser || null) as any,
    isAuthenticated,
    isLoading: isAuthenticated && isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
