import type { Role, RolePage, User } from "@prisma/client";
import type { CreateUserRequestDto, UpdateUserRequestDto } from "../../dtos/user.dto";

/**
 * 包含角色的使用者資料
 */
export type UserWithRole = User & {
  role:
    | (Role & {
        rolePages: (RolePage & {
          page: {
            pageCode: number;
            isActive: boolean;
          };
        })[];
      })
    | null;

  node: {
    id: string;
    code: string;
    name: string;
    type: string;
    isActive: boolean;
  };
};

export interface IUserRepository {
  create(data: CreateUserRequestDto & { nodeId: string }): Promise<User>;
  findById(id: string): Promise<UserWithRole | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByEmail(email: string): Promise<UserWithRole | null>;
  findByAccount(account: string): Promise<UserWithRole | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
    nodeId?: string;
  }): Promise<[UserWithRole[], number]>;
  update(id: string, data: UpdateUserRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<number>;
}
