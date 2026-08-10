// src/repositories/interface/user.repository.interface.ts
import type { Prisma, User } from "@prisma/client";
import type { CreateUserDto } from "../../dtos/user.dto";

export interface IUserRepository {
  /**
   * 創建新使用者
   * @param data 使用者資料
   * @returns 建立後的使用者資料
   */
  create(data: CreateUserDto): Promise<User>;
  /**
   * 根據 ID 查找使用者
   * @param id 使用者 uuid
   * @returns 使用者資料
   */
  findById(id: string): Promise<User | null>;
  /**
   * 根據電子郵件查找使用者
   * @param email 電子郵件
   * @returns 使用者資料
   */
  findByEmail(email: string): Promise<User | null>;
  /**
   * 根據使用者名稱查找使用者
   * @param username 使用者名稱
   * @returns 使用者資料
   */
  findByUsername(username: string): Promise<User | null>;
  /**
   * 查詢使用者列表與總數
   * @param params 查詢參數
   * @returns 使用者列表及總數
   */
  findAndCount(params: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<[User[], number]>;
}
