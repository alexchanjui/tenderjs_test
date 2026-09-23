// src/repositories/prisma/permission.prisma.repository.ts
import { Permission } from "@prisma/client";
import { IPermissionRepository } from "../interface/permission.repository.interface";
import { IDbContext } from "../../types/db.context";
import { CreatePermissionRequestDto, UpdatePermissionRequestDto } from "../../dtos/permission.dto";

export class PermissionPrismaRepository implements IPermissionRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立新權限
   */
  public async create(data: CreatePermissionRequestDto): Promise<Permission> {
    return this.ctx.prisma.permission.create({ data });
  }

  /**
   * 取得所有權限
   */
  public async findAll(): Promise<Permission[]> {
    return this.ctx.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * 根據 ID 查找權限
   */
  public async findById(id: number): Promise<Permission | null> {
    return this.ctx.prisma.permission.findUnique({
      where: { id },
    });
  }

  /**
   * 根據權限名稱查找權限
   */
  public async findByName(name: string): Promise<Permission | null> {
    return this.ctx.prisma.permission.findUnique({
      where: { name },
    });
  }

  /**
   * 根據 featureCode 查找權限
   */
  public async findByFeatureCode(featureCode: number): Promise<Permission[]> {
    return this.ctx.prisma.permission.findMany({
      where: { featureCode, isActive: true },
    });
  }

  /**
   * 取得權限列表 (分頁)
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Permission[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.permission.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { sortOrder: "asc" },
      }),
      this.ctx.prisma.permission.count(),
    ]);
  }
  /**
   * 更新權限資料
   */
  public async update(id: number, data: UpdatePermissionRequestDto): Promise<void> {
    await this.ctx.prisma.permission.update({
      where: { id },
      data,
    });
  }

  /**
   * 批次刪除權限
   */
  public async batchDelete(ids: number[]): Promise<void> {
    await this.ctx.prisma.permission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  /**
   * 調整權限排序
   */
  public async adjustSortOrder(
    id: number,
    oldSortOrder: number,
    newSortOrder: number,
  ): Promise<number> {
    const total = await this.ctx.prisma.permission.count();

    // 限制排序範圍 1 ~ 總筆數
    const sortOrder = Math.min(Math.max(newSortOrder, 1), total);

    await this.ctx.prisma.$transaction(async (tx) => {
      if (sortOrder < oldSortOrder) {
        await tx.permission.updateMany({
          where: {
            sortOrder: {
              gte: sortOrder,
              lt: oldSortOrder,
            },
          },
          data: {
            sortOrder: {
              increment: 1,
            },
          },
        });
      } else {
        await tx.permission.updateMany({
          where: {
            sortOrder: {
              gt: oldSortOrder,
              lte: sortOrder,
            },
          },
          data: {
            sortOrder: {
              decrement: 1,
            },
          },
        });
      }

      await tx.permission.update({
        where: { id },
        data: { sortOrder },
      });
    });

    return sortOrder;
  }
}
