// src/repositories/interface/role.repository.interface.ts
import type { Role, RoleFeature } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";

/**
 * 包含功能權限與使用人數的角色資料
 */
export type RoleWithFeatures = Role & {
  roleFeatures: RoleFeature[];
  _count: {
    users: number;
  };
};

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<RoleWithFeatures | null>;
  findByName(name: string): Promise<Role | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[RoleWithFeatures[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  countUsersByRoleIds(ids: string[]): Promise<number>;
  batchDelete(ids: string[]): Promise<void>;
  updateFeatures(
    roleId: string,
    features: { featureCode: number; accessLevel: string }[],
  ): Promise<void>;
}
