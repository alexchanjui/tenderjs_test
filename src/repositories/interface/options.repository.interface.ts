// src/repositories/interface/options.repository.interface.ts
import type { Node, Page, Role, FaqCategory } from "@prisma/client";

export type NodeWithPages = Node & {
  nodePages: {
    page: {
      pageCode: number;
    };
  }[];
};

export interface IOptionsRepository {
  findAllRoles(): Promise<Role[]>;
  findAllPages(): Promise<Page[]>;
  findAllNodes(): Promise<NodeWithPages[]>;
  findAllFaqCategories(): Promise<FaqCategory[]>;
}
