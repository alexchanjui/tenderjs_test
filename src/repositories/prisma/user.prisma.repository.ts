// src/repositories/prisma/user.prisma.repository.ts
import type { PrismaClient, User } from "@prisma/client";
import type { CreateUserDto } from "../../dtos/user.dto";
import type { IUserRepository } from "../interface/user.repository.interface";

/**
 * 使用 Prisma 實作 User Repository
 */
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 建立使用者
   */
  public async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });
  }

  /**
   * 依 ID 取得使用者
   */
  public async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 依 Email 取得使用者
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
