import type { Permission } from "./auth";

// Khớp đúng chữ thường do JsonStringEnumConverter(CamelCase) phía backend
// serialize/deserialize (vd AuthProvider.Ldap <-> "ldap").
export type AuthProvider = "local" | "ldap";

export interface ManagedUser {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  zoneIds: number[];
  createdAt: string;
  // A12 — null (cả 2) = không giới hạn giờ dùng quyền. Phút trong ngày (0..1439).
  timeWindowStartMinutes: number | null;
  timeWindowEndMinutes: number | null;
  // H21
  authProvider: AuthProvider;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface CreateUserInput {
  username: string;
  password: string;
  roleId: number;
  zoneIds: number[];
  timeWindowStartMinutes?: number | null;
  timeWindowEndMinutes?: number | null;
  authProvider?: AuthProvider;
}

export interface UpdateUserInput {
  password?: string;
  roleId?: number;
  zoneIds?: number[];
  updateTimeWindow?: boolean;
  timeWindowStartMinutes?: number | null;
  timeWindowEndMinutes?: number | null;
}
