// src/repositories/prisma/role.prisma.repository.ts
import type { Role } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";
import type { IDbContext } from "../../types/db.context";
import type { IRoleRepository, RoleWithPageGroups } from "../interface/role.repository.interface";

export class RolePrismaRepository implements IRoleRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立新角色
   */
  public async create(data: CreateRoleRequestDto): Promise<Role> {
    return this.ctx.prisma.role.create({ data });
  }

  /**
   * 取得所有角色
   */
  public async findAll(): Promise<Role[]> {
    return this.ctx.prisma.role.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * 根據 ID 查找角色
   */
  public async findById(id: string): Promise<RoleWithPageGroups | null> {
    return this.ctx.prisma.role.findUnique({
      where: { id },
      include: {
        rolePageGroups: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }

  /**
   * 根據角色名稱查找角色
   */
  public async findByName(name: string): Promise<Role | null> {
    return this.ctx.prisma.role.findUnique({
      where: { name },
    });
  }

  /**
   * 取得角色列表（分頁）
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[RoleWithPageGroups[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.role.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          rolePageGroups: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      }),
      this.ctx.prisma.role.count(),
    ]);
  }

  /**
   * 更新角色資料
   */
  public async update(id: string, data: UpdateRoleRequestDto): Promise<void> {
    await this.ctx.prisma.role.update({
      where: { id },
      data,
    });
  }

  /**
   * 計算角色使用人數
   */
  public async countUsersByRoleIds(ids: string[]): Promise<number> {
    return this.ctx.prisma.user.count({
      where: {
        roleId: {
          in: ids,
        },
      },
    });
  }

  /**
   * 批次刪除角色
   */
  public async batchDelete(ids: string[]): Promise<void> {
    await this.ctx.prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  /**
   * 更新角色的頁面群組權限
   */
  public async updatePageGroups(
    roleId: string,
    pageGroups: { pageGroupCode: number; accessLevel: string }[],
  ): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      // 先清除原本頁面群組權限
      await tx.rolePageGroup.deleteMany({
        where: {
          roleId,
        },
      });

      // 再重新建立新的頁面群組權限
      if (pageGroups.length > 0) {
        await tx.rolePageGroup.createMany({
          data: pageGroups.map((pageGroup) => ({
            roleId,
            pageGroupCode: pageGroup.pageGroupCode,
            accessLevel: pageGroup.accessLevel,
          })),
        });
      }
    });
  }
}
