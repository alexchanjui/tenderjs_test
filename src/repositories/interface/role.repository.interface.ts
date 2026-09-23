// src/repositories/interfaces/role.repository.interface.ts
import type { Permission, Role } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

/**
 * 包含使用人數的角色資料
 */
export type RoleWithUserCount = Role & {
  _count: {
    users: number;
  };
};

/**
 * 包含權限與使用人數的角色資料
 */
export type RoleWithPermissions = Role & {
  rolePermissions: {
    permission: Permission;
  }[];
  _count: {
    users: number;
  };
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findById(id: string): Promise<RoleWithPermissions | null>;
  findByName(name: string): Promise<Role | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[RoleWithUserCount[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  countUsersByRoleIds(ids: string[]): Promise<number>;
  batchDelete(ids: string[]): Promise<void>;
  updatePermissions(roleId: string, permissionIds: number[]): Promise<void>;
}
