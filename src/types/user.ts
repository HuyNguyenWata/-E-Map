import type { Permission } from "./auth";

export interface ManagedUser {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  zoneIds: number[];
  createdAt: string;
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
}

export interface UpdateUserInput {
  password?: string;
  roleId?: number;
  zoneIds?: number[];
}
