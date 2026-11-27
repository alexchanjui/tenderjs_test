// src/services/page.service.ts
import { plainToInstance } from "class-transformer";
import {
  PageResponseDto,
  type CreatePageRequestDto,
  type UpdatePageRequestDto,
} from "../dtos/page.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { invalidateAllRolePages } from "../caches/rolePage.cache";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class PageService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得頁面列表（分頁）
   */
  public async getPages(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PageResponseDto>> {
    const { page, limit, keyword } = dto;
    const skip = (page - 1) * limit;

    const [pages, total] = await this.ctx.repos.page.findAndCount({
      skip,
      take: limit,
      keyword,
    });

    return {
      data: plainToInstance(PageResponseDto, pages, {
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
   * 建立頁面
   */
  public async createPage(data: CreatePageRequestDto): Promise<void> {
    const page = await this.ctx.repos.page.findByCode(data.pageCode);

    if (page) {
      throw new AppError(ErrorCode.DUPLICATE, "頁面代碼已存在");
    }

    await this.ctx.repos.page.create(data);
  }

  /**
   * 更新頁面
   */
  public async updatePage(id: number, data: UpdatePageRequestDto): Promise<void> {
    await this.ctx.repos.page.update(id, data);

    // 啟用或停用頁面後，清除舊的權限快取，避免停用的頁面仍可被存取
    if (data.isActive !== undefined) {
      await invalidateAllRolePages();
    }
  }

  /**
   * 刪除頁面
   */
  public async deletePage(id: number): Promise<void> {
    await this.ctx.repos.page.delete(id);
    await invalidateAllRolePages();
  }
}
