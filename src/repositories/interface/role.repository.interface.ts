// src/repositories/interfaces/role.repository.interface.ts
import type { Role } from "@prisma/client";
import type {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
} from "../../dtos/role.dto";

export interface IRoleRepository {
  create(data: CreateRoleRequestDto): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Role[], number]>;
  update(id: string, data: UpdateRoleRequestDto): Promise<void>;
  delete(id: string): Promise<void>;
}
