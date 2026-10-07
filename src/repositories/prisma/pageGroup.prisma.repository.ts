// src/repositories/prisma/pageGroup.prisma.repository.ts
import type { PageGroup } from "@prisma/client";
import type {
  CreatePageGroupRequestDto,
  UpdatePageGroupRequestDto,
} from "../../dtos/pageGroup.dto";
import type { IDbContext } from "../../types/db.context";
import type { IPageGroupRepository } from "../interface/pageGroup.repository.interface";

export class PageGroupPrismaRepository implements IPageGroupRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立頁面群組
   */
  public async create(data: CreatePageGroupRequestDto): Promise<PageGroup> {
    return this.ctx.prisma.pageGroup.create({
      data,
    });
  }

  /**
   * 取得所有啟用的頁面群組
   */
  public async findAll(): Promise<PageGroup[]> {
    return this.ctx.prisma.pageGroup.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  /**
   * 根據頁面群組代碼查找頁面群組
   */
  public async findByCode(pageGroupCode: number): Promise<PageGroup | null> {
    return this.ctx.prisma.pageGroup.findUnique({
      where: {
        pageGroupCode,
      },
    });
  }

  /**
   * 取得頁面群組列表（分頁）
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[PageGroup[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.pageGroup.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          sortOrder: "asc",
        },
      }),
      this.ctx.prisma.pageGroup.count(),
    ]);
  }

  /**
   * 更新頁面群組
   */
  public async update(pageGroupCode: number, data: UpdatePageGroupRequestDto): Promise<void> {
    await this.ctx.prisma.pageGroup.update({
      where: {
        pageGroupCode,
      },
      data,
    });
  }

  /**
   * 批次刪除頁面群組
   */
  public async batchDelete(pageGroupCodes: number[]): Promise<void> {
    await this.ctx.prisma.pageGroup.deleteMany({
      where: {
        pageGroupCode: {
          in: pageGroupCodes,
        },
      },
    });
  }
}
