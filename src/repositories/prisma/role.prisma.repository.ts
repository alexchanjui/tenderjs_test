// src/repositories/prisma/role.prisma.repository.ts
import type { Role } from "@prisma/client";
import type { IRoleRepository, RoleWithFeatures } from "../interface/role.repository.interface";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";
import { IDbContext } from "../../types/db.context";

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
  public async findById(id: string): Promise<RoleWithFeatures | null> {
    return this.ctx.prisma.role.findUnique({
      where: { id },
      include: {
        roleFeatures: true,
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
   * 取得角色列表 (分頁)
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[RoleWithFeatures[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.role.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          roleFeatures: true,
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
   * 更新角色的功能權限
   */
  public async updateFeatures(
    roleId: string,
    features: { featureCode: number; accessLevel: string }[],
  ): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      // 先清除原本功能權限
      await tx.roleFeature.deleteMany({
        where: {
          roleId,
        },
      });

      // 再重新建立新的功能權限
      if (features.length > 0) {
        await tx.roleFeature.createMany({
          data: features.map((feature) => ({
            roleId,
            featureCode: feature.featureCode,
            accessLevel: feature.accessLevel,
          })),
        });
      }
    });
  }
}
