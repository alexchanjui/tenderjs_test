// src/repositories/interface/options.repository.interface.ts
import type { Node, Page, Role } from "@prisma/client";

export interface IOptionsRepository {
  findAllRoles(): Promise<Role[]>;
  findAllPages(): Promise<Page[]>;
  findAllNodes(): Promise<Node[]>;
}
