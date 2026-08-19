// src/repositories/prisma/permission.prisma.repository.ts
import { Permission } from "@prisma/client";
import { IPermissionRepository } from "../interface/permission.repository.interface";
import { IDbContext } from "../../types/db.context";
import {
  CreatePermissionRequestDto,
  UpdatePermissionRequestDto,
} from "../../dtos/permission.dto";

export class PermissionPrismaRepository implements IPermissionRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立新權限
   */
  public async create(data: CreatePermissionRequestDto): Promise<Permission> {
    return this.ctx.prisma.permission.create({ data });
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
        orderBy: { createdAt: "desc" },
      }),
      this.ctx.prisma.permission.count(),
    ]);
  }

  /**
   * 更新權限資料
   */
  public async update(
    id: number,
    data: UpdatePermissionRequestDto,
  ): Promise<void> {
    await this.ctx.prisma.permission.update({
      where: { id },
      data,
    });
  }

  /**
   * 刪除權限
   */
  public async delete(id: number): Promise<void> {
    await this.ctx.prisma.permission.delete({
      where: { id },
    });
  }
}
