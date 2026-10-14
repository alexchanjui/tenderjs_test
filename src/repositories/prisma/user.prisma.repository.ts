// src/repositories/prisma/user.prisma.repository.ts
import type { User } from "@prisma/client";
import type { CreateUserRequestDto, UpdateUserRequestDto } from "../../dtos/user.dto";
import type { IDbContext } from "../../types/db.context";
import type { IUserRepository, UserWithRole } from "../interface/user.repository.interface";

export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立使用者
   */
  public async create(data: CreateUserRequestDto): Promise<User> {
    return this.ctx.prisma.user.create({ data });
  }

  /**
   * 根據 ID 取得使用者
   */
  public async findById(id: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            rolePages: {
              include: {
                page: {
                  select: {
                    pageCode: true,
                  },
                },
              },
            },
          },
        },
        node: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * 根據 Email 取得使用者
   */
  public async findByEmail(email: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            rolePages: {
              include: {
                page: {
                  select: {
                    pageCode: true,
                  },
                },
              },
            },
          },
        },
        node: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * 根據帳號取得使用者
   */
  public async findByAccount(account: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { account },
      include: {
        role: {
          include: {
            rolePages: {
              include: {
                page: {
                  select: {
                    pageCode: true,
                  },
                },
              },
            },
          },
        },
        node: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * 取得使用者列表 (分頁)
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[UserWithRole[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.user.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          role: {
            include: {
              rolePages: {
                include: {
                  page: {
                    select: {
                      pageCode: true,
                    },
                  },
                },
              },
            },
          },
          node: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              isActive: true,
            },
          },
        },
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
   * 批次刪除使用者
   */
  public async batchDelete(ids: string[]): Promise<number> {
    const result = await this.ctx.prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result.count;
  }
}
