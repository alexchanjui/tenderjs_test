// src/container.ts
import loggerInstance from "./utils/logger";
import prismaInstance from "./utils/prisma";
import redisInstance from "./utils/redis";
import { requestContextStorage } from "./utils/request-context";

import { UserPrismaRepository } from "./repositories/prisma/user.prisma.repository";
import { RolePrismaRepository } from "./repositories/prisma/role.prisma.repository";
import { PermissionPrismaRepository } from "./repositories/prisma/permission.prisma.repository";
import { PagePrismaRepository } from "./repositories/prisma/page.prisma.repository";
import { VendorPrismaRepository } from "./repositories/prisma/vendor.prisma.repository";

import { HealthService } from "./services/health.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { RoleService } from "./services/role.service";
import { PermissionService } from "./services/permission.service";
import { OptionsService } from "./services/options.service";
import { PageService } from "./services/page.service";
import { VendorService } from "./services/vendor.service";

import type { IController } from "./controllers/interface/controller.interface";
import { HealthController } from "./controllers/health.controller";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import { RoleController } from "./controllers/role.controller";
import { PermissionController } from "./controllers/permission.controller";
import { OptionsController } from "./controllers/options.controller";
import { PageController } from "./controllers/page.controller";
import { VendorController } from "./controllers/vendor.controller";

import type { IServiceContext } from "./types/service.context";
import type { IDbContext } from "./types/db.context";

export class AppContainer {
  public getControllers(): IController[] {
    const dbContext: IDbContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
    };

    const userRepo = new UserPrismaRepository(dbContext);
    const roleRepo = new RolePrismaRepository(dbContext);
    const permissionRepo = new PermissionPrismaRepository(dbContext);
    const pageRepo = new PagePrismaRepository(dbContext);
    const vendorRepo = new VendorPrismaRepository(dbContext);

    const ctx: IServiceContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
      redis: redisInstance.client,
      repos: {
        user: userRepo,
        role: roleRepo,
        permission: permissionRepo,
        page: pageRepo,
        vendor: vendorRepo,
      },
      get currentUser() {
        return requestContextStorage.getStore();
      },
    };

    return [
      new HealthController(new HealthService(ctx)),
      new UserController(new UserService(ctx)),
      new AuthController(new AuthService(ctx)),
      new RoleController(new RoleService(ctx)),
      new PermissionController(new PermissionService(ctx)),
      new OptionsController(new OptionsService(ctx)),
      new PageController(new PageService(ctx)),
      new VendorController(new VendorService(ctx)),
    ];
  }
}
