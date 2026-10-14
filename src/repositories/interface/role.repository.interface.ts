// src/repositories/interface/role.repository.interface.ts
import type { Role, RolePage } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

/**
 * 包含頁面權限與使用人數的角色資料
 */
export type RoleWithPages = Role & {
  rolePages: (RolePage & {
    page: {
      pageCode: number;
    };
  })[];
  _count: {
    users: number;
  };
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findById(id: string): Promise<RoleWithPages | null>;
  findByIds(ids: string[]): Promise<Role[]>;
  findByNodeId(nodeId: string): Promise<Role[]>;
  findByName(name: string, nodeId: string): Promise<Role | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
    nodeId?: string;
  }): Promise<[RoleWithPages[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  countUsersByRoleIds(ids: string[]): Promise<number>;
  batchDelete(ids: string[]): Promise<void>;
  updatePages(roleId: string, pages: { pageId: number }[]): Promise<void>;
}
