// src/types/service.context.ts
import type { PrismaClient } from "@prisma/client";
import type Redis from "ioredis";
import type { LoggerService } from "../utils/logger";
import type { IUserRepository } from "../repositories/interface/user.repository.interface";
import type { IRoleRepository } from "../repositories/interface/role.repository.interface";
import type { IPermissionRepository } from "../repositories/interface/permission.repository.interface";
import type { IPageRepository } from "../repositories/interface/page.repository.interface";
import type { UserType } from "./account-scope";

export interface CurrentUser {
  id: string;
  roleId: string | null;
  userType: UserType;
  vendorId: string | null;
}

export interface IRepositoryContext {
  user: IUserRepository;
  role: IRoleRepository;
  permission: IPermissionRepository;
  page: IPageRepository;
}

export interface IServiceContext {
  logger: LoggerService;
  prisma: PrismaClient;
  redis: Redis;
  repos: IRepositoryContext;
  currentUser?: CurrentUser;
}
