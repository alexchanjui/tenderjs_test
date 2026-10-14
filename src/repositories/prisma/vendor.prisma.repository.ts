import bcrypt from "bcrypt";
import type { Node } from "@prisma/client";
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

    await this.ctx.prisma.$transaction(async (tx) => {
      // 建立業者節點
      const vendor = await tx.node.create({
        data: {
          ...vendorData,
          type: "VENDOR",
        },
      });

      // 建立業者最高管理員角色
      const role = await tx.role.create({
        data: {
          name: "業者最高管理員",
          nodeId: vendor.id,
          isVendorAdmin: true,
        },
      });

      // 建立首位管理員
      await tx.user.create({
        data: {
          account: admin.account,
          username: admin.username,
          email: admin.email,
          password: hashedPassword,
          nodeId: vendor.id,
          roleId: role.id,
        },
      });
    });
  }

  /**
   * 根據 ID 查找業者
   */
  public async findById(id: string): Promise<VendorWithPages | null> {
    return this.ctx.prisma.node.findFirst({
      where: {
        id,
        type: "VENDOR",
      },
      include: {
        nodePages: {
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
   * 根據代碼查找業者
   */
  public async findByCode(code: string): Promise<Node | null> {
    return this.ctx.prisma.node.findFirst({
      where: {
        code,
        type: "VENDOR",
      },
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
      this.ctx.prisma.node.findMany({
        where: {
          type: "VENDOR",
        },
        skip: params.skip,
        take: params.take,
        include: {
          nodePages: {
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

      this.ctx.prisma.node.count({
        where: {
          type: "VENDOR",
        },
      }),
    ]);
  }

  /**
   * 更新業者
   */
  public async update(id: string, data: UpdateVendorRequestDto): Promise<void> {
    await this.ctx.prisma.node.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * 批次刪除業者
   */
  public async batchDelete(ids: string[]): Promise<number> {
    const result = await this.ctx.prisma.node.deleteMany({
      where: {
        id: {
          in: ids,
        },
        type: "VENDOR",
      },
    });

    return result.count;
  }

  /**
   * 更新業者頁面權限
   */
  public async updatePages(nodeId: string, pages: { pageId: number }[]): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      // 更新業者可使用的頁面
      await tx.nodePage.deleteMany({
        where: {
          nodeId,
        },
      });

      if (pages.length > 0) {
        await tx.nodePage.createMany({
          data: pages.map((page) => ({
            nodeId,
            pageId: page.pageId,
          })),
        });
      }

      // 取得業者最高管理員角色
      const vendorAdminRole = await tx.role.findFirst({
        where: {
          nodeId,
          isVendorAdmin: true,
        },
      });

      if (vendorAdminRole) {
        // 最高管理員權限與 NodePage 完全同步
        await tx.rolePage.deleteMany({
          where: {
            roleId: vendorAdminRole.id,
          },
        });

        if (pages.length > 0) {
          await tx.rolePage.createMany({
            data: pages.map((page) => ({
              roleId: vendorAdminRole.id,
              pageId: page.pageId,
            })),
          });
        }
      }

      // 一般角色不可保留超出 NodePage 的頁面權限
      await tx.rolePage.deleteMany({
        where: {
          role: {
            nodeId,
            isVendorAdmin: false,
          },
          pageId: {
            notIn: pages.map((page) => page.pageId),
          },
        },
      });
    });
  }
}
