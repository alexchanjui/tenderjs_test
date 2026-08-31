// src/repositories/prisma/user.prisma.repository.ts
import type { User } from "@prisma/client";
import type { CreateUserDto, UpdateUserRequestDto } from "../../dtos/user.dto";
import type { IUserRepository } from "../interface/user.repository.interface";
import type { IDbContext } from "../../types/db.context";

/**
 * 使用 Prisma 實作 User Repository
 */
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立使用者
   */
  public async create(data: CreateUserDto): Promise<User> {
    return this.ctx.prisma.user.create({ data });
  }

  /**
   * 根據 ID 取得使用者
   */
  public async findById(id: string): Promise<User | null> {
    return this.ctx.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * 根據 Email 取得使用者
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.ctx.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * 根據 Username 取得使用者
   */
  public async findByUsername(username: string): Promise<User | null> {
    return this.ctx.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * 取得使用者列表 (分頁)
   */
  public async findAndCount(params: { skip?: number; take?: number }): Promise<[User[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.user.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      this.ctx.prisma.user.count(),
    ]);
  }

  /**
   * 更新使用者
   */
  public async update(id: string, data: UpdateUserRequestDto): Promise<void> {
    await this.ctx.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * 刪除使用者
   */
  public async delete(id: string): Promise<void> {
    await this.ctx.prisma.user.delete({
      where: { id },
    });
  }
}
