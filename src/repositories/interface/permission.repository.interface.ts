// src/repositories/interface/permission.repository.interface.ts
import type { Permission } from "@prisma/client";
import {
  CreatePermissionRequestDto,
  UpdatePermissionRequestDto,
} from "../../dtos/permission.dto";

export interface IPermissionRepository {
  create(data: CreatePermissionRequestDto): Promise<Permission>;
  findAll(): Promise<Permission[]>;
  findById(id: number): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByFeatureCode(featureCode: number): Promise<Permission[]>;
  findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Permission[], number]>;
  update(id: number, data: UpdatePermissionRequestDto): Promise<void>;
  delete(id: number): Promise<void>;
}
