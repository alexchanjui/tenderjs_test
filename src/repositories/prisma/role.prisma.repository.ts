// src/repositories/prisma/role.prisma.repository.ts
import type { Role } from "@prisma/client";
import type { IRoleRepository, RoleWithPermissions } from "../interface/role.repository.interface";
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
   * 根據 ID 查找角色
   */
  public async findById(id: string): Promise<RoleWithPermissions | null> {
    return this.ctx.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
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
  }): Promise<[RoleWithPermissions[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.role.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
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
   * 更新角色的權限
   */
  public async updatePermissions(roleId: string, permissionIds: number[]): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      // 先清除原本權限
      await tx.rolePermission.deleteMany({
        where: {
          roleId,
        },
      });

      // 再重新建立新的權限
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
        });
      }
    });
  }
}
