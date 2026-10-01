// src/caches/role-feature.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

/**
 * 角色功能權限
 */
export interface ICachedRoleFeature {
  featureCode: number;
  accessLevel: string;
}

/**
 * 取得角色功能權限 Redis Key
 */
const getRoleFeatureKey = (roleId: string): string => {
  return `role:features:${roleId.toLowerCase()}`;
};

/**
 * 取得角色擁有的功能權限
 *
 * Redis 有資料直接使用，
 * Redis 沒資料則從 DB 查詢並寫入 Redis。
 */
export const getRoleFeatures = async (roleId: string): Promise<ICachedRoleFeature[]> => {
  const key = getRoleFeatureKey(roleId);

  // 1. 先從 Redis 取得
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as ICachedRoleFeature[];
  }

  // 2. Redis 沒有資料，從 DB 查詢
  const role = await prismaInstance.client.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      roleFeatures: true,
    },
  });

  if (!role) {
    return [];
  }

  // 3. 取得角色擁有的功能權限
  const roleFeatures = role.roleFeatures.map((roleFeature) => ({
    featureCode: roleFeature.featureCode,
    accessLevel: roleFeature.accessLevel,
  }));

  // 4. 寫入 Redis，1 小時後過期
  await redisInstance.client.set(key, JSON.stringify(roleFeatures), "EX", 3600);

  return roleFeatures;
};

/**
 * 清除指定角色功能權限 Redis 快取
 */
export const invalidateRoleFeatures = async (roleId: string): Promise<void> => {
  const key = getRoleFeatureKey(roleId);

  await redisInstance.client.del(key);
};

/**
 * 清除所有角色功能權限 Redis 快取
 */
export const invalidateAllRoleFeatures = async (): Promise<void> => {
  const keys = await redisInstance.client.keys("role:features:*");

  if (keys.length === 0) {
    return;
  }

  await redisInstance.client.del(...keys);
};
