// src/services/role.service.ts

import { plainToInstance } from "class-transformer";
import {
  CreateRoleRequestDto,
  GetRoleListRequestDto,
  GetRoleListResponseDto,
  RoleResponseDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class RoleService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立角色
   */
  public async createRole(
    data: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const existingRole = await this.ctx.repos.role.findByName(data.name);

    if (existingRole) {
      throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
    }

    const role = await this.ctx.repos.role.create(data);

    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得角色列表
   */
  public async getRoles(
    dto: GetRoleListRequestDto,
  ): Promise<GetRoleListResponseDto> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [roles, total] = await this.ctx.repos.role.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(RoleResponseDto, roles, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 取得單一角色
   */
  public async getRoleById(id: string): Promise<RoleResponseDto> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新角色
   */
  public async updateRole(
    id: string,
    data: UpdateRoleRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await this.ctx.repos.role.findByName(data.name);

      if (existingRole) {
        throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
      }
    }

    await this.ctx.repos.role.update(id, data);
  }

  /**
   * 刪除角色
   */
  public async deleteRole(id: string): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    await this.ctx.repos.role.delete(id);
  }
}
