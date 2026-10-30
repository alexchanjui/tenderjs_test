// src/repositories/interface/options.repository.interface.ts
import type { FaqCategory, Node, Page, Role } from "@prisma/client";

export type NodeWithPages = Node & {
  nodePages: {
    page: {
      pageCode: number;
    };
  }[];
};

export interface IOptionsRepository {
  findAllRoles(nodeId: string): Promise<Role[]>;
  findAllPages(): Promise<Page[]>;
  findAllNodes(): Promise<NodeWithPages[]>;
  findAllFaqCategories(nodeId: string): Promise<FaqCategory[]>;
}
