// src/types/service.context.ts
import type { PrismaClient } from "@prisma/client";
import type Redis from "ioredis";
import type { IFaqRepository } from "../repositories/interface/faq.repository.interface";
import type { IOptionsRepository } from "../repositories/interface/options.repository.interface";
import type { IPageRepository } from "../repositories/interface/page.repository.interface";
import { IPermissionRepository } from "../repositories/interface/permission.repository.interface";
import { IRoleRepository } from "../repositories/interface/role.repository.interface";
import { IUserRepository } from "../repositories/interface/user.repository.interface";
import type { IVendorRepository } from "../repositories/interface/vendor.repository.interface";
import type { LoggerService } from "../utils/logger";

/**
 * 目前登入的使用者資訊
 */
export interface CurrentUser {
  id: string;
  roleId: string | null;
  nodeId: string;
  nodeType: "OPERATOR" | "VENDOR";
}

/**
 * Request Context
 */
export interface RequestContext {
  currentUser: CurrentUser;
  currentNodeId: string;
}

/**
 * Repository 集合
 */
export interface IRepositoryContext {
  user: IUserRepository;
  role: IRoleRepository;
  permission: IPermissionRepository;
  page: IPageRepository;
  vendor: IVendorRepository;
  options: IOptionsRepository;
  faq: IFaqRepository;
}

/**
 * Service 共用依賴
 */
export interface IServiceContext {
  logger: LoggerService;
  prisma: PrismaClient;
  redis: Redis;
  repos: IRepositoryContext; // 統一的 Repo 存取點
  currentUser?: CurrentUser; // 當前登入者
  currentNodeId?: string; // 當前操作的 Node
}
