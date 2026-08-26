// src/services/cache-init.service.ts
import { reloadRules } from "../caches/permission.cache";
import prismaInstance from "../utils/prisma";

class CacheInitService {
  /**
   * 初始化系統快取
   */
  public async initialize(): Promise<void> {
    await this.reloadPermissionRules();
  }

  /**
   * 重新載入 API 權限規則
   */
  public async reloadPermissionRules(): Promise<void> {
    const permissions = await prismaInstance.client.permission.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    reloadRules(permissions);
  }
}

export default new CacheInitService();
