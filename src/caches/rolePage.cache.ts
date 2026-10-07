// src/caches/rolePage.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

/**
 * 角色頁面權限
 */
export interface ICachedRolePage {
  pageCode: number;
  accessLevel: string;
}

/**
 * 取得角色頁面權限 Redis Key
 */
const getRolePageKey = (roleId: string): string => {
  return `role:pages:${roleId.toLowerCase()}`;
};

/**
 * 取得角色擁有的頁面權限
 *
 * Redis 有資料直接使用，
 * Redis 沒資料則從 DB 查詢並寫入 Redis。
 */
export const getRolePages = async (roleId: string): Promise<ICachedRolePage[]> => {
  const key = getRolePageKey(roleId);

  // 1. 先從 Redis 取得
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as ICachedRolePage[];
  }

  // 2. Redis 沒有資料，從 DB 查詢
  const role = await prismaInstance.client.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      rolePages: true,
    },
  });

  if (!role) {
    return [];
  }

  // 3. 取得角色擁有的頁面權限
  const rolePages = role.rolePages.map((rolePage) => ({
    pageCode: rolePage.pageCode,
    accessLevel: rolePage.accessLevel,
  }));

  // 4. 寫入 Redis，1 小時後過期
  await redisInstance.client.set(key, JSON.stringify(rolePages), "EX", 3600);

  return rolePages;
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
  const keys = await redisInstance.client.keys("role:pages:*");

  if (keys.length === 0) {
    return;
  }

  await redisInstance.client.del(...keys);
};
