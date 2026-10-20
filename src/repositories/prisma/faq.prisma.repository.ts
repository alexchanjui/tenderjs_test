// src/repositories/prisma/faq.prisma.repository.ts
import type { Faq, FaqCategory } from "@prisma/client";

import type {
  CreateFaqCategoryRequestDto,
  CreateFaqRequestDto,
  UpdateFaqCategoryRequestDto,
  UpdateFaqRequestDto,
} from "../../dtos/faq.dto";
import type { IDbContext } from "../../types/db.context";
import type { IFaqRepository } from "../interface/faq.repository.interface";

export class FaqPrismaRepository implements IFaqRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 新增問答分類
   */
  public async createCategory(
    vendorProfileId: string,
    data: CreateFaqCategoryRequestDto,
  ): Promise<FaqCategory> {
    return this.ctx.prisma.faqCategory.create({
      data: {
        vendorProfileId,
        title: data.title,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
  }

  /**
   * 取得問答分類列表
   */
  public async findAllCategories(vendorProfileId: string): Promise<FaqCategory[]> {
    return this.ctx.prisma.faqCategory.findMany({
      where: {
        vendorProfileId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  /**
   * 取得問答分類
   */
  public async findCategoryById(id: string): Promise<FaqCategory | null> {
    return this.ctx.prisma.faqCategory.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 更新問答分類
   */
  public async updateCategory(id: string, data: UpdateFaqCategoryRequestDto): Promise<void> {
    await this.ctx.prisma.faqCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * 刪除問答分類
   */
  public async deleteCategory(id: string): Promise<void> {
    await this.ctx.prisma.faqCategory.delete({
      where: {
        id,
      },
    });
  }

  /**
   * 新增問答
   */
  public async createQa(data: CreateFaqRequestDto): Promise<Faq> {
    return this.ctx.prisma.faq.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        content: data.content,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
  }

  /**
   * 取得問答列表
   */
  public async findAllQa(categoryId: string): Promise<Faq[]> {
    return this.ctx.prisma.faq.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  /**
   * 取得問答
   */
  public async findQaById(id: string): Promise<Faq | null> {
    return this.ctx.prisma.faq.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 更新問答
   */
  public async updateQa(id: string, data: UpdateFaqRequestDto): Promise<void> {
    await this.ctx.prisma.faq.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * 刪除問答
   */
  public async deleteQa(id: string): Promise<void> {
    await this.ctx.prisma.faq.delete({
      where: {
        id,
      },
    });
  }
}
