// src/repositories/prisma/vendor.prisma.repository.ts
import bcrypt from "bcrypt";
import type { Vendor } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";
import type { IDbContext } from "../../types/db.context";
import type { IVendorRepository, VendorWithPages } from "../interface/vendor.repository.interface";

export class VendorPrismaRepository implements IVendorRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 建立業者與首位管理員
   */
  public async createWithAdmin(data: CreateVendorRequestDto): Promise<void> {
    const { admin, ...vendorData } = data;
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    return this.ctx.prisma.$transaction(async (tx) => {
      const vendor = await tx.vendor.create({
        data: vendorData,
      });

      const role = await tx.role.create({
        data: {
          name: "業者最高管理員",
          vendorId: vendor.id,
          isVendorAdmin: true,
        },
      });

      await tx.user.create({
        data: {
          account: admin.account,
          username: admin.username,
          email: admin.email,
          password: hashedPassword,
          vendorId: vendor.id,
          roleId: role.id,
        },
      });
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
    const pageIds = pages.map((page) => page.pageId);

    await this.ctx.prisma.$transaction(async (tx) => {
      // 更新業者頁面權限
      await tx.vendorPage.deleteMany({
        where: { vendorId },
      });

      if (pageIds.length > 0) {
        await tx.vendorPage.createMany({
          data: pageIds.map((pageId) => ({
            vendorId,
            pageId,
          })),
        });
      }

      // 取得業者最高管理員角色
      const vendorAdminRole = await tx.role.findFirst({
        where: {
          vendorId,
          isVendorAdmin: true,
        },
      });

      // 同步業者最高管理員頁面權限
      if (vendorAdminRole) {
        await tx.rolePage.deleteMany({
          where: {
            roleId: vendorAdminRole.id,
          },
        });

        if (pageIds.length > 0) {
          await tx.rolePage.createMany({
            data: pageIds.map((pageId) => ({
              roleId: vendorAdminRole.id,
              pageId,
            })),
          });
        }
      }

      // 移除一般角色已超出業者範圍的頁面權限
      await tx.rolePage.deleteMany({
        where: {
          role: {
            vendorId,
            isVendorAdmin: false,
          },
          pageId: {
            notIn: pageIds,
          },
        },
      });
    });
  }
}
