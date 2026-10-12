// src/caches/rolePage.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

/**
 * 取得角色頁面權限 Redis Key
 */
const getRolePageKey = (roleId: string): string => {
  return `role:pages:v3:${roleId.toLowerCase()}`;
};

/**
 * 取得角色擁有的頁面 ID
 *
 * Redis 有資料直接使用，
 * Redis 沒資料則從 DB 查詢並寫入 Redis。
 */
export const getRolePageIds = async (roleId: string): Promise<number[]> => {
  const key = getRolePageKey(roleId);

  // 1. 先從 Redis 取得
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as number[];
  }

  // 2. Redis 沒有資料，從 DB 查詢
  const rolePages = await prismaInstance.client.rolePage.findMany({
    where: {
      roleId,
    },
    select: {
      pageId: true,
    },
  });

  // 3. 取得角色擁有的頁面 ID
  const pageIds = rolePages.map((rolePage) => rolePage.pageId);

  // 4. 寫入 Redis，1 小時後過期
  await redisInstance.client.set(key, JSON.stringify(pageIds), "EX", 3600);

  return pageIds;
};

/**
 * 清除指定角色頁面權限 Redis 快取
 */
export const invalidateRolePages = async (roleId: string): Promise<void> => {
  const key = getRolePageKey(roleId);

  await redisInstance.client.del(key);
};

/**
 * 清除所有角色頁面權限 Redis 快取
 */
export const invalidateAllRolePages = async (): Promise<void> => {
  const keys = await redisInstance.client.keys("role:pages:v3:*");

  if (keys.length === 0) {
    return;
  }

  await redisInstance.client.del(...keys);
};
