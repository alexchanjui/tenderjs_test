// src/services/product-tag.service.ts
import { plainToInstance } from "class-transformer";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  ProductTagResponseDto,
  type CreateProductTagRequestDto,
  type UpdateProductTagRequestDto,
} from "../dtos/product-tag.dto";
import type { IServiceContext } from "../types/service.context";

export class ProductTagService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得商品標籤列表（分頁）
   */
  public async getProductTags(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ProductTagResponseDto>> {
    const { page, limit, keyword } = dto;
    const skip = (page - 1) * limit;

    const [tags, total] = await this.ctx.repos.productTag.findAndCount({
      skip,
      take: limit,
      keyword,
    });

    return {
      data: plainToInstance(ProductTagResponseDto, tags, {
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
   * 建立商品標籤
   */
  public async createProductTag(data: CreateProductTagRequestDto): Promise<void> {
    await this.ctx.repos.productTag.create(data);
  }

  /**
   * 更新商品標籤
   */
  public async updateProductTag(id: number, data: UpdateProductTagRequestDto): Promise<void> {
    await this.ctx.repos.productTag.update(id, data);
  }

  /**
   * 刪除商品標籤
   */
  public async deleteProductTag(id: number): Promise<void> {
    await this.ctx.repos.productTag.delete(id);
  }
}
