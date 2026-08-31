// src/repositories/interfaces/role.repository.interface.ts
import type { Role, Permission } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

/**
 * 包含權限的角色資料
 */
export type RoleWithPermissions = Role & {
  rolePermissions: {
    permission: Permission;
  }[];
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findById(id: string): Promise<RoleWithPermissions | null>;
  findByName(name: string): Promise<Role | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[Role[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  delete(id: string): Promise<void>;
  updatePermissions(roleId: string, permissionIds: number[]): Promise<void>;
}
