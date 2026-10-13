// src/repositories/prisma/vendor.prisma.repository.ts
import type { Vendor } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";
import type { IDbContext } from "../../types/db.context";
import type { IVendorRepository, VendorWithPages } from "../interface/vendor.repository.interface";

export class VendorPrismaRepository implements IVendorRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立新業者
   */
  public async create(data: CreateVendorRequestDto): Promise<Vendor> {
    return await this.ctx.prisma.vendor.create({
      data,
    });
  }

  /**
   * 根據 ID 查找業者
   */
  public async findById(id: string): Promise<VendorWithPages | null> {
    return this.ctx.prisma.vendor.findUnique({
      where: { id },
      include: {
        vendorPages: {
          include: {
            page: {
              select: {
                pageCode: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 根據業者代碼查找業者
   */
  public async findByCode(code: string): Promise<Vendor | null> {
    return this.ctx.prisma.vendor.findUnique({
      where: { code },
    });
  }

  /**
   * 取得業者列表（分頁）
   */
  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[VendorWithPages[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.vendor.findMany({
        skip: params.skip,
        take: params.take,
        include: {
          vendorPages: {
            include: {
              page: {
                select: {
                  pageCode: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.ctx.prisma.vendor.count(),
    ]);
  }

  /**
   * 更新業者資料
   */
  public async update(id: string, data: UpdateVendorRequestDto): Promise<void> {
    await this.ctx.prisma.vendor.update({
      where: { id },
      data,
    });
  }

  /**
   * 批次刪除業者
   */
  public async batchDelete(ids: string[]): Promise<number> {
    const result = await this.ctx.prisma.vendor.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }

  /**
   * 更新業者頁面權限
   */
  public async updatePages(vendorId: string, pages: { pageId: number }[]): Promise<void> {
    await this.ctx.prisma.$transaction([
      this.ctx.prisma.vendorPage.deleteMany({
        where: { vendorId },
      }),
      this.ctx.prisma.vendorPage.createMany({
        data: pages.map((page) => ({
          vendorId,
          pageId: page.pageId,
        })),
      }),
    ]);
  }
}
