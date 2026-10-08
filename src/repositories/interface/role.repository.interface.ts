// src/repositories/interface/role.repository.interface.ts
import type { Role, RolePage, RolePermission } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

export type RoleWithPermissions = Role & {
  rolePages: RolePage[];
  rolePermissions: RolePermission[];
  _count: { users: number };
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<RoleWithPermissions | null>;
  findByName(name: string, scope: string, vendorId: string | null): Promise<Role | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
    scope?: string;
    vendorId?: string | null;
  }): Promise<[RoleWithPermissions[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  countUsersByRoleIds(ids: string[]): Promise<number>;
  batchDelete(ids: string[]): Promise<void>;
  updatePages(roleId: string, pageIds: number[]): Promise<void>;
  updatePermissions(roleId: string, permissionIds: number[]): Promise<void>;
}
