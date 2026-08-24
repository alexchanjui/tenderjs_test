// src/utils/cache.service.ts
import redisInstance from "./redis";
import prismaInstance from "./prisma";

/**
 * 系統快取 Service
 */
export const CacheService = {
  /**
   * 取得角色對應的權限 ID 列表
   *
   * Redis 有資料時直接使用 Redis，
   * Redis 沒有資料時從 DB 查詢並寫入 Redis。
   */
  async getRolePermissions(roleId: string): Promise<number[]> {
    const key = `role:permissions:${roleId.toLowerCase()}`;

    // 1. 從 Redis 取得角色權限
    const cached = await redisInstance.client.get(key);

    if (cached) {
      return JSON.parse(cached) as number[];
    }

    // 2. Redis 沒有資料，從 DB 查詢
    const role = await prismaInstance.client.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        rolePermissions: true,
      },
    });

    if (!role) {
      return [];
    }

    // 3. 取得 Permission ID
    const permissionIds = role.rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );

    // 4. 寫入 Redis，1 小時後過期
    await redisInstance.client.set(
      key,
      JSON.stringify(permissionIds),
      "EX",
      3600,
    );

    return permissionIds;
  },

  /**
   * 清除角色權限快取
   *
   * 修改角色權限後呼叫，
   * 下一次取得角色權限時會重新從 DB 載入。
   */
  async invalidateRolePermissions(roleId: string): Promise<void> {
    const key = `role:permissions:${roleId.toLowerCase()}`;

    await redisInstance.client.del(key);
  },
};
