// src/services/page.service.ts
import { plainToInstance } from "class-transformer";
import { CreatePageRequestDto, PageResponseDto, UpdatePageRequestDto } from "../dtos/page.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class PageService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立頁面
   */
  public async createPage(data: CreatePageRequestDto): Promise<PageResponseDto> {
    const page = await this.ctx.repos.page.findByCode(data.pageCode);

    if (page) {
      throw new AppError(ErrorCode.DUPLICATE, "頁面代碼已存在");
    }

    const newPage = await this.ctx.repos.page.create(data);

    return plainToInstance(PageResponseDto, newPage, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得頁面列表（分頁）
   */
  public async getPages(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PageResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [pages, total] = await this.ctx.repos.page.findAndCount({
      skip,
      take: limit,
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
   * 取得頁面詳細資訊
   */
  public async getPageById(id: number): Promise<PageResponseDto> {
    const page = await this.ctx.repos.page.findById(id);

    if (!page) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
    }

    return plainToInstance(PageResponseDto, page, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新頁面
   */
  public async updatePage(id: number, data: UpdatePageRequestDto): Promise<void> {
    if ("pageCode" in data) {
      throw new AppError(ErrorCode.REQUEST_DATA, "頁面代碼建立後不可修改");
    }

    const page = await this.ctx.repos.page.findById(id);

    if (!page) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
    }

    await this.ctx.repos.page.update(id, data);
  }

  /**
   * 批次刪除頁面
   */
  public async batchDeletePage(ids: number[]): Promise<void> {
    for (const id of ids) {
      const page = await this.ctx.repos.page.findById(id);

      if (!page) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
      }
    }

    await this.ctx.repos.page.batchDelete(ids);
  }
}
