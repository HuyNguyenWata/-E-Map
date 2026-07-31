import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as loginApi } from "../api/client";
import { getToken, setToken, setUnauthorizedHandler } from "../api/authToken";
import type { AuthUser, Permission } from "../types/auth";

const USER_STORAGE_KEY = "vms_user";
const DEMO_FLAG_KEY = "vms_demo_mode";

// Người dùng ảo cho chế độ xem demo (offline, không có backend) — chỉ có
// quyền xem, không có quyền quản trị/chỉnh sửa nào (CameraFormModal, nút
// Thêm/Sửa/Xoá... đều tự ẩn vì đã gate qua hasPermission ở nơi dùng).
export const DEMO_USER: AuthUser = {
  username: "demo",
  roleName: "Xem Demo (Offline)",
  permissions: ["ViewLive", "ViewPlayback"],
  isDemo: true,
};

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (localStorage.getItem(DEMO_FLAG_KEY) === "1") return DEMO_USER;

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
    // Bỏ qua khi đang ở chế độ demo — demo không có token thật nên nếu backend
    // thật sự tồn tại và trả 401 cho request không kèm token, không được văng
    // người dùng ra khỏi màn hình demo họ vừa chủ động chọn.
    setUnauthorizedHandler(() => {
      if (localStorage.getItem(DEMO_FLAG_KEY) === "1") return;

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

    localStorage.removeItem(DEMO_FLAG_KEY);
    setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  // Vào thẳng chế độ xem demo (offline) mà không cần backend — dùng khi
  // LoginPage phát hiện không kết nối được máy chủ. Không gọi API, không có
  // token thật; đánh dấu bằng DEMO_FLAG_KEY để còn nhớ lại sau khi F5.
  const loginDemo = () => {
    localStorage.setItem(DEMO_FLAG_KEY, "1");
    setUser(DEMO_USER);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(DEMO_FLAG_KEY);
    setUser(null);
  };

  const hasPermission = (permission: Permission) =>
    Array.isArray(user?.permissions) && user.permissions.includes(permission);

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}
