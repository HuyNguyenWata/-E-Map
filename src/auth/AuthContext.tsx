import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as loginApi } from "../api/client";
import { getToken, setToken, setUnauthorizedHandler } from "../api/authToken";
import type { AuthUser, Permission } from "../types/auth";

const USER_STORAGE_KEY = "vms_user";

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (!getToken()) return null;

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    // Dữ liệu cũ/hỏng trong localStorage (vd. từ bản trước khi có field
    // permissions) không được để lọt xuống dưới — sẽ làm cả app crash trắng
    // màn hình vì hasPermission gọi .includes() trên undefined.
    if (!parsed || !Array.isArray(parsed.permissions)) return null;
    return parsed;
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
    const authUser: AuthUser = {
      username: res.username,
      roleName: res.roleName,
      permissions: res.permissions,
    };

    setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const hasPermission = (permission: Permission) =>
    Array.isArray(user?.permissions) && user.permissions.includes(permission);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}
