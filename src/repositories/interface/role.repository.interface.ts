// src/repositories/interface/role.repository.interface.ts
import type { Role, RolePageGroup } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

/**
 * 包含頁面群組權限與使用人數的角色資料
 */
export type RoleWithPageGroups = Role & {
  rolePageGroups: RolePageGroup[];
  _count: {
    users: number;
  };
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<RoleWithPageGroups | null>;
  findByName(name: string): Promise<Role | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[RoleWithPageGroups[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  countUsersByRoleIds(ids: string[]): Promise<number>;
  batchDelete(ids: string[]): Promise<void>;
  updatePageGroups(
    roleId: string,
    pageGroups: { pageGroupCode: number; accessLevel: string }[],
  ): Promise<void>;
}
