// src/caches/rolePageGroup.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

/**
 * 角色頁面群組權限
 */
export interface ICachedRolePageGroup {
  pageGroupCode: number;
  accessLevel: string;
}

/**
 * 取得角色頁面群組權限 Redis Key
 */
const getRolePageGroupKey = (roleId: string): string => {
  return `role:page-groups:${roleId.toLowerCase()}`;
};

/**
 * 取得角色擁有的頁面群組權限
 *
 * Redis 有資料直接使用，
 * Redis 沒資料則從 DB 查詢並寫入 Redis。
 */
export const getRolePageGroups = async (roleId: string): Promise<ICachedRolePageGroup[]> => {
  const key = getRolePageGroupKey(roleId);

  // 1. 先從 Redis 取得
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as ICachedRolePageGroup[];
  }

  // 2. Redis 沒有資料，從 DB 查詢
  const role = await prismaInstance.client.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      rolePageGroups: true,
    },
  });

  if (!role) {
    return [];
  }

  // 3. 取得角色擁有的頁面群組權限
  const rolePageGroups = role.rolePageGroups.map((rolePageGroup) => ({
    pageGroupCode: rolePageGroup.pageGroupCode,
    accessLevel: rolePageGroup.accessLevel,
  }));

  // 4. 寫入 Redis，1 小時後過期
  await redisInstance.client.set(key, JSON.stringify(rolePageGroups), "EX", 3600);

  return rolePageGroups;
};

/**
 * 清除指定角色頁面群組權限 Redis 快取
 */
export const invalidateRolePageGroups = async (roleId: string): Promise<void> => {
  const key = getRolePageGroupKey(roleId);

  await redisInstance.client.del(key);
};

/**
 * 清除所有角色頁面群組權限 Redis 快取
 */
export const invalidateAllRolePageGroups = async (): Promise<void> => {
  const keys = await redisInstance.client.keys("role:page-groups:*");

  if (keys.length === 0) {
    return;
  }

  await redisInstance.client.del(...keys);
};
