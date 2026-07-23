import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as loginApi } from "../api/client";
import { getToken, setToken, setUnauthorizedHandler } from "../api/authToken";
import type { AuthUser } from "../types/auth";

const USER_STORAGE_KEY = "vms_user";

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (!getToken()) return null;

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  useEffect(() => {
    // Khi bất kỳ API call nào nhận 401 (token hết hạn/bị thu hồi), tự động đăng xuất.
    setUnauthorizedHandler(() => {
      setToken(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    });
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    const authUser: AuthUser = { username: res.username, role: res.role };

    setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}
