// src/services/pageGroup.service.ts
import { plainToInstance } from "class-transformer";
import {
  CreatePageGroupRequestDto,
  PageGroupResponseDto,
  UpdatePageGroupRequestDto,
} from "../dtos/pageGroup.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class PageGroupService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立頁面群組
   */
  public async createPageGroup(data: CreatePageGroupRequestDto): Promise<PageGroupResponseDto> {
    const pageGroup = await this.ctx.repos.pageGroup.findByCode(data.pageGroupCode);

    if (pageGroup) {
      throw new AppError(ErrorCode.DUPLICATE, "頁面群組代碼已存在");
    }

    const newPageGroup = await this.ctx.repos.pageGroup.create(data);

    return plainToInstance(PageGroupResponseDto, newPageGroup, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得頁面群組列表（分頁）
   */
  public async getPageGroups(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PageGroupResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [pageGroups, total] = await this.ctx.repos.pageGroup.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(PageGroupResponseDto, pageGroups, {
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
   * 取得頁面群組詳細資訊
   */
  public async getPageGroupByCode(pageGroupCode: number): Promise<PageGroupResponseDto> {
    const pageGroup = await this.ctx.repos.pageGroup.findByCode(pageGroupCode);

    if (!pageGroup) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面群組不存在");
    }

    return plainToInstance(PageGroupResponseDto, pageGroup, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新頁面群組
   */
  public async updatePageGroup(
    pageGroupCode: number,
    data: UpdatePageGroupRequestDto,
  ): Promise<void> {
    const pageGroup = await this.ctx.repos.pageGroup.findByCode(pageGroupCode);

    if (!pageGroup) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面群組不存在");
    }

    await this.ctx.repos.pageGroup.update(pageGroupCode, data);
  }

  /**
   * 批次刪除頁面群組
   */
  public async batchDeletePageGroup(pageGroupCodes: number[]): Promise<void> {
    for (const pageGroupCode of pageGroupCodes) {
      const pageGroup = await this.ctx.repos.pageGroup.findByCode(pageGroupCode);

      if (!pageGroup) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面群組不存在");
      }
    }

    await this.ctx.repos.pageGroup.batchDelete(pageGroupCodes);
  }
}
