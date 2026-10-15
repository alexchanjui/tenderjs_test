// src/repositories/prisma/options.prisma.repository.ts
import type { Page, Role } from "@prisma/client";

import type { IDbContext } from "../../types/db.context";
import type { IOptionsRepository, NodeWithPages } from "../interface/options.repository.interface";

export class OptionsPrismaRepository implements IOptionsRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 取得所有角色
   */
  public async findAllRoles(): Promise<Role[]> {
    return this.ctx.prisma.role.findMany({
      where: {
        isActive: true,
      },
    });
  }

  /**
   * 取得所有頁面
   */
  public async findAllPages(): Promise<Page[]> {
    return this.ctx.prisma.page.findMany({
      where: {
        isActive: true,
      },
    });
  }

  /**
   * 取得所有組織節點
   */
  public async findAllNodes(): Promise<NodeWithPages[]> {
    return this.ctx.prisma.node.findMany({
      where: {
        isActive: true,
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
}
