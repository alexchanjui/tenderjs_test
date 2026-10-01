// src/services/feature.service.ts
import { plainToInstance } from "class-transformer";
import type { IServiceContext } from "../types/service.context";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateFeatureRequestDto,
  FeatureResponseDto,
  UpdateFeatureRequestDto,
} from "../dtos/feature.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";

export class FeatureService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立頁面功能
   */
  public async createFeature(data: CreateFeatureRequestDto): Promise<FeatureResponseDto> {
    const feature = await this.ctx.repos.feature.findByCode(data.featureCode);

    if (feature) {
      throw new AppError(ErrorCode.DUPLICATE, "功能代碼已存在");
    }

    const newFeature = await this.ctx.repos.feature.create(data);

    return plainToInstance(FeatureResponseDto, newFeature, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得頁面功能列表 (分頁)
   */
  public async getFeatures(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<FeatureResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [features, total] = await this.ctx.repos.feature.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(FeatureResponseDto, features, {
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
   * 取得頁面功能詳細資訊
   */
  public async getFeatureByCode(featureCode: number): Promise<FeatureResponseDto> {
    const feature = await this.ctx.repos.feature.findByCode(featureCode);

    if (!feature) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面功能不存在");
    }

    return plainToInstance(FeatureResponseDto, feature, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新頁面功能
   */
  public async updateFeature(featureCode: number, data: UpdateFeatureRequestDto): Promise<void> {
    const feature = await this.ctx.repos.feature.findByCode(featureCode);

    if (!feature) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面功能不存在");
    }

    await this.ctx.repos.feature.update(featureCode, data);
  }

  /**
   * 批次刪除頁面功能
   */
  public async batchDeleteFeature(featureCodes: number[]): Promise<void> {
    for (const featureCode of featureCodes) {
      const feature = await this.ctx.repos.feature.findByCode(featureCode);

      if (!feature) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面功能不存在");
      }
    }

    await this.ctx.repos.feature.batchDelete(featureCodes);
  }
}
