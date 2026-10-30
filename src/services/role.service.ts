// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import { invalidateRolePages } from "../caches/rolePage.cache";
import type { BatchDeleteStringIdsDto } from "../dtos/common.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateRoleRequestDto,
  RoleResponseDto,
  UpdateRolePagesRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class RoleService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得目前操作的 Node ID
   */
  private getCurrentNodeId(): string {
    const currentNodeId = this.ctx.currentNodeId;

    if (!currentNodeId) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentNodeId;
  }

  /**
   * 建立角色
   */
  public async createRole(data: CreateRoleRequestDto): Promise<void> {
    const currentNodeId = this.getCurrentNodeId();

    // 檢查同一節點內角色名稱是否重複
    const role = await this.ctx.repos.role.findByName(data.name, currentNodeId);

    if (role) {
      throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
    }

    // 建立角色
    await this.ctx.repos.role.create({
      ...data,
      nodeId: currentNodeId,
    });
  }

  /**
   * 取得角色列表（分頁）
   */
  public async getRoles(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<RoleResponseDto>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const currentNodeId = this.getCurrentNodeId();

    const [roles, total] = await this.ctx.repos.role.findAndCount({
      skip,
      take: limit,
      nodeId: currentNodeId,
    });

    const data = roles.map((role) => ({
      ...role,
      userCount: role._count.users,
      pageCodes: role.rolePages.map((rolePage) => rolePage.page.pageCode),
    }));

    return {
      data: plainToInstance(RoleResponseDto, data, {
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
   * 取得角色詳細資訊
   */
  public async getRoleById(id: string): Promise<RoleResponseDto> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        userCount: role._count.users,
        pageCodes: role.rolePages.map((rolePage) => rolePage.page.pageCode),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * 更新角色
   */
  public async updateRole(id: string, data: UpdateRoleRequestDto): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    // 最高管理員角色不可修改
    if (role.name === "superAdmin" || role.isVendorAdmin) {
      throw new AppError(ErrorCode.FAIL, "最高管理員角色不可修改");
    }

    // 檢查同一節點內角色名稱是否重複
    if (data.name && data.name !== role.name) {
      const existingRole = await this.ctx.repos.role.findByName(data.name, role.nodeId);

      if (existingRole) {
        throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
      }
    }

    // 更新角色
    await this.ctx.repos.role.update(id, data);
  }

  /**
   * 批次刪除角色
   */
  public async batchDeleteRole(dto: BatchDeleteStringIdsDto): Promise<void> {
    const { ids } = dto;

    const roles = await this.ctx.repos.role.findByIds(ids);

    // 確認角色皆存在
    if (roles.length !== ids.length) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    // 檢查是否包含最高管理員角色
    const adminRole = roles.find((role) => role.name === "superAdmin" || role.isVendorAdmin);

    if (adminRole) {
      throw new AppError(ErrorCode.REQUEST_DATA, "最高管理員角色不可刪除");
    }

    // 檢查角色是否仍有使用者
    const userCount = await this.ctx.repos.role.countUsersByRoleIds(ids);

    if (userCount > 0) {
      throw new Error(`選取的角色仍有 ${userCount} 位使用者使用，無法刪除。`);
    }

    // 刪除角色
    await this.ctx.repos.role.batchDelete(ids);
  }

  /**
   * 更新角色頁面權限
   */
  public async updateRolePages(roleId: string, dto: UpdateRolePagesRequestDto): Promise<void> {
    // 確認角色存在
    const role = await this.ctx.repos.role.findById(roleId);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    // 最高管理員權限由 NodePage 自動同步
    if (role.name === "superAdmin" || role.isVendorAdmin) {
      throw new AppError(ErrorCode.FAIL, "最高管理員權限不可手動修改");
    }

    // 檢查頁面是否重複
    if (new Set(dto.pageCodes).size !== dto.pageCodes.length) {
      throw new AppError(ErrorCode.REQUEST_DATA, "頁面不可重複設定");
    }

    // 取得所有頁面
    const pages = await this.ctx.repos.page.findAll();
    const pageIdByCode = new Map(pages.map((page) => [page.pageCode, page.id]));

    // 檢查頁面是否存在
    const invalidPageCode = dto.pageCodes.find((pageCode) => !pageIdByCode.has(pageCode));

    if (invalidPageCode !== undefined) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
    }

    // 角色只能設定角色所屬節點已授權的頁面
    const node = await this.ctx.repos.vendor.findById(role.nodeId);

    if (!node) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "組織節點不存在");
    }

    const nodePageCodes = new Set(node.nodePages.map((nodePage) => nodePage.page.pageCode));

    const unauthorizedPageCode = dto.pageCodes.find((pageCode) => !nodePageCodes.has(pageCode));

    if (unauthorizedPageCode !== undefined) {
      throw new AppError(ErrorCode.FAIL, "角色頁面權限不可超出組織授權範圍");
    }

    // 轉換為 RolePage
    const rolePages = dto.pageCodes.map((pageCode) => ({
      pageId: pageIdByCode.get(pageCode)!,
    }));

    // 更新角色頁面權限
    await this.ctx.repos.role.updatePages(roleId, rolePages);

    // 清除角色頁面權限快取
    await invalidateRolePages(roleId);
  }
}
