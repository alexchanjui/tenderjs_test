// src/repositories/prisma/feature.prisma.repository.ts
import type { Feature } from "@prisma/client";
import type { IFeatureRepository } from "../interface/feature.repository.interface";
import type { IDbContext } from "../../types/db.context";
import type { CreateFeatureRequestDto, UpdateFeatureRequestDto } from "../../dtos/feature.dto";

export class FeaturePrismaRepository implements IFeatureRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立頁面功能
   */
  public async create(data: CreateFeatureRequestDto): Promise<Feature> {
    return this.ctx.prisma.feature.create({
      data,
    });
  }

  /**
   * 取得所有啟用的頁面功能
   */
  public async findAll(): Promise<Feature[]> {
    return this.ctx.prisma.feature.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  /**
   * 根據功能代碼查找頁面功能
   */
  public async findByCode(featureCode: number): Promise<Feature | null> {
    return this.ctx.prisma.feature.findUnique({
      where: {
        featureCode,
      },
    });
  }

  /**
   * 取得頁面功能列表 (分頁)
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[Feature[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.feature.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          sortOrder: "asc",
        },
      }),
      this.ctx.prisma.feature.count(),
    ]);
  }

  /**
   * 更新頁面功能
   */
  public async update(featureCode: number, data: UpdateFeatureRequestDto): Promise<void> {
    await this.ctx.prisma.feature.update({
      where: {
        featureCode,
      },
      data,
    });
  }

  /**
   * 批次刪除頁面功能
   */
  public async batchDelete(featureCodes: number[]): Promise<void> {
    await this.ctx.prisma.feature.deleteMany({
      where: {
        featureCode: {
          in: featureCodes,
        },
      },
    });
  }
}
