// src/repositories/prisma/page.prisma.repository.ts
import type { Page } from "@prisma/client";
import type { CreatePageRequestDto, UpdatePageRequestDto } from "../../dtos/page.dto";
import type { IDbContext } from "../../types/db.context";
import type { IPageRepository } from "../interface/page.repository.interface";

export class PagePrismaRepository implements IPageRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立頁面
   */
  public async create(data: CreatePageRequestDto): Promise<Page> {
    return this.ctx.prisma.page.create({
      data,
    });
  }

  /**
   * 取得所有啟用的頁面
   */
  public async findAll(): Promise<Page[]> {
    return this.ctx.prisma.page.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        pageCode: "asc",
      },
    });
  }

  /**
   * 根據頁面代碼查找頁面
   */
  public async findByCode(pageCode: number): Promise<Page | null> {
    return this.ctx.prisma.page.findUnique({
      where: {
        pageCode,
      },
    });
  }

  /**
   * 取得頁面列表（分頁）
   */
  public async findAndCount(params: { skip?: number; take?: number }): Promise<[Page[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.page.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: {
          pageCode: "asc",
        },
      }),
      this.ctx.prisma.page.count(),
    ]);
  }

  /**
   * 更新頁面
   */
  public async update(pageCode: number, data: UpdatePageRequestDto): Promise<void> {
    await this.ctx.prisma.page.update({
      where: {
        pageCode,
      },
      data,
    });
  }

  /**
   * 批次刪除頁面
   */
  public async batchDelete(pageCodes: number[]): Promise<void> {
    await this.ctx.prisma.page.deleteMany({
      where: {
        pageCode: {
          in: pageCodes,
        },
      },
    });
  }
}
