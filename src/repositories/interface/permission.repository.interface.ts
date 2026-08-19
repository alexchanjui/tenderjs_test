// src/repositories/interface/permission.repository.interface.ts
import type { Permission } from "@prisma/client";
import {
  CreatePermissionRequestDto,
  UpdatePermissionRequestDto,
} from "../../dtos/permission.dto";

export interface IPermissionRepository {
  create(data: CreatePermissionRequestDto): Promise<Permission>;
  findById(id: number): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Permission[], number]>;
  update(id: number, data: UpdatePermissionRequestDto): Promise<void>;
  delete(id: number): Promise<void>;
}
