// src/repositories/prisma/node-scope.prisma.repository.ts

import type { IDbContext } from "../../types/db.context";
import type { INodeScopeRepository } from "../interface/node-scope.repository.interface";

export class NodeScopePrismaRepository implements INodeScopeRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 取得指定節點可存取的節點 ID
   */
  public async getAccessibleNodeIds(nodeId: string): Promise<string[]> {
    const currentNode = await this.ctx.prisma.node.findUnique({
      where: { id: nodeId },
    });

    if (!currentNode) {
      return [];
    }

    // 業者只能存取自己的節點
    if (currentNode.type === "VENDOR") {
      return [currentNode.id];
    }

    // 營運可以存取自己與所有業者節點
    const vendorNodes = await this.ctx.prisma.node.findMany({
      where: {
        type: "VENDOR",
      },
      select: {
        id: true,
      },
    });

    return [currentNode.id, ...vendorNodes.map((node) => node.id)];
  }
}
