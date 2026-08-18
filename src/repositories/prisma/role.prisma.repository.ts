// src/repositories/prisma/role.prisma.repository.ts

import type { Role } from "@prisma/client";
import type {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
} from "../../dtos/role.dto";
import type { IRoleRepository } from "../interface/role.repository.interface";
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
  public async findById(id: string): Promise<Role | null> {
    return this.ctx.prisma.role.findUnique({
      where: { id },
    });
  }

  /**
   * 根據角色名稱查找角色
   */
  public async findByName(name: string): Promise<Role | null> {
    return this.ctx.prisma.role.findUnique({
      where: {
        name,
      },
    });
  }

  /**
   * 取得角色列表 (分頁)
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Role[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.role.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
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
   * 刪除角色
   */
  public async delete(id: string): Promise<void> {
    await this.ctx.prisma.role.delete({
      where: { id },
    });
  }
}
