// src/repositories/interface/user.repository.interface.ts
import { User, Role, RolePermission, Permission } from "@prisma/client";
import type { CreateUserDto, UpdateUserRequestDto } from "../../dtos/user.dto";

/**
 * 包含角色的使用者資料
 */
export type UserWithRole = User & {
  role:
    | (Role & {
        rolePermissions: (RolePermission & {
          permission: Permission;
        })[];
      })
    | null;
};

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<UserWithRole | null>;
  findByEmail(email: string): Promise<UserWithRole | null>;
  findByUsername(username: string): Promise<UserWithRole | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[User[], number]>;
  update(id: string, data: UpdateUserRequestDto): Promise<void>;
  delete(id: string): Promise<void>;
}
