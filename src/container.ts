// src/container.ts
import loggerInstance from "./utils/logger";
import prismaInstance from "./utils/prisma";
import redisInstance from "./utils/redis";
import { requestContextStorage } from "./utils/request-context";

// Repositories
import { UserPrismaRepository } from "./repositories/prisma/user.prisma.repository";
import { RolePrismaRepository } from "./repositories/prisma/role.prisma.repository";
import { PermissionPrismaRepository } from "./repositories/prisma/permission.prisma.repository";
import { PagePrismaRepository } from "./repositories/prisma/page.prisma.repository";
import { VendorPrismaRepository } from "./repositories/prisma/vendor.prisma.repository";
import { OptionsPrismaRepository } from "./repositories/prisma/options.prisma.repository";
import { VendorProfilePrismaRepository } from "./repositories/prisma/vendorProfile.prisma.repository";
import { FaqPrismaRepository } from "./repositories/prisma/faq.prisma.repository";

// Services
import { HealthService } from "./services/health.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { RoleService } from "./services/role.service";
import { PermissionService } from "./services/permission.service";
import { PageService } from "./services/page.service";
import { VendorService } from "./services/vendor.service";
import { OptionsService } from "./services/options.service";
import { VendorProfileService } from "./services/vendorProfile.service";
import { FaqService } from "./services/faq.service";

// Controllers
import type { IController } from "./controllers/interface/controller.interface";
import { HealthController } from "./controllers/health.controller";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import { RoleController } from "./controllers/role.controller";
import { PermissionController } from "./controllers/permission.controller";
import { PageController } from "./controllers/page.controller";
import { VendorController } from "./controllers/vendor.controller";
import { OptionsController } from "./controllers/options.controller";
import { VendorProfileController } from "./controllers/vendorProfile.controller";
import { FaqController } from "./controllers/faq.controller";

// Types
import type { IServiceContext } from "./types/service.context";
import type { IDbContext } from "./types/db.context";

/**
 * 應用程式容器
 *
 * 負責建立共用依賴，並組裝 Service 與 Controller，
 * 最後提供 Controller 清單給 Routes 使用。
 * Tip: 這裡只在 App 啟動時執行一次。
 */
export class AppContainer {
  public getControllers(): IController[] {
    /**
     * 建立 Repository Context (DB Context)
     */
    const dbContext: IDbContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
    };

    /**
     * 建立 Repositories
     */
    const userRepo = new UserPrismaRepository(dbContext);
    const roleRepo = new RolePrismaRepository(dbContext);
    const permissionRepo = new PermissionPrismaRepository(dbContext);
    const pageRepo = new PagePrismaRepository(dbContext);
    const vendorRepo = new VendorPrismaRepository(dbContext);
    const optionsRepo = new OptionsPrismaRepository(dbContext);
    const vendorProfileRepo = new VendorProfilePrismaRepository(dbContext);
    const faqRepo = new FaqPrismaRepository(dbContext);

    /**
     * 建立 Service 共用依賴
     */
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
        options: optionsRepo,
        vendorProfile: vendorProfileRepo,
        faq: faqRepo,
      },
      get currentUser() {
        return requestContextStorage.getStore();
      },
    };

    /**
     * 組裝 Services
     */
    const healthService = new HealthService(ctx);
    const userService = new UserService(ctx);
    const authService = new AuthService(ctx);
    const roleService = new RoleService(ctx);
    const permissionService = new PermissionService(ctx);
    const pageService = new PageService(ctx);
    const vendorService = new VendorService(ctx);
    const optionsService = new OptionsService(ctx);
    const vendorProfileService = new VendorProfileService(ctx);
    const faqService = new FaqService(ctx);

    /**
     * 組裝 Controllers
     */
    return [
      new HealthController(healthService),
      new UserController(userService),
      new AuthController(authService),
      new RoleController(roleService),
      new PermissionController(permissionService),
      new PageController(pageService),
      new VendorController(vendorService),
      new OptionsController(optionsService),
      new VendorProfileController(vendorProfileService),
      new FaqController(faqService),
    ];
  }
}
