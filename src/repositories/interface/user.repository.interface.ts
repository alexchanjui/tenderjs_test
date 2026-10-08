// src/repositories/interface/user.repository.interface.ts
import type { Role, RolePage, RolePermission, User } from "@prisma/client";
import type { CreateUserDto, UpdateUserRequestDto } from "../../dtos/user.dto";

export type UserWithRole = User & {
  role:
    | (Role & {
        rolePages: RolePage[];
        rolePermissions: RolePermission[];
      })
    | null;
};

export interface IUserRepository {
  create(data: CreateUserDto & { password: string }): Promise<User>;
  findById(id: string): Promise<UserWithRole | null>;
  findByEmail(email: string): Promise<UserWithRole | null>;
  findByUsername(username: string): Promise<UserWithRole | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
    vendorId?: string | null;
    userType?: string;
  }): Promise<[UserWithRole[], number]>;
  update(id: string, data: UpdateUserRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<number>;
}
