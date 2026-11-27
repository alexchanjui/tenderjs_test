// src/services/product-category.service.ts
import { IServiceContext } from "../types/service.context";
import type {
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from "../dtos/product-category.dto";
import { PageResponseDto } from "../dtos/page.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { PaginationResponseDto } from "../dtos/pagination.dto";
import { plainToInstance } from "class-transformer";

export class ProductCategoryService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得商品分類列表 (分頁)
   */
  public async getProductCategories(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PageResponseDto>> {
    const { page, limit, keyword } = dto;

    const skip = (page - 1) * limit;

    const [pages, total] = await this.ctx.repos.productCategory.findAndCount({
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
   * 建立商品分類
   */
  public async createProductCategory(data: CreateProductCategoryRequestDto): Promise<void> {
    await this.ctx.repos.productCategory.create(data);
  }

  /**
   * 更新商品分類
   */
  public async updateProductCategory(
    id: number,
    data: UpdateProductCategoryRequestDto,
  ): Promise<void> {
    await this.ctx.repos.productCategory.update(id, data);
  }

  /**
   * 刪除商品分類
   */
  public async deleteProductCategory(id: number): Promise<void> {
    await this.ctx.repos.productCategory.delete(id);
  }
}
