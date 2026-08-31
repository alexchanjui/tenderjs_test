// src/caches/role-permission.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

/**
 * 取得角色權限 Redis Key
 */
const getRolePermissionKey = (roleId: string): string => {
  return `role:permissions:${roleId.toLowerCase()}`;
};

/**
 * 取得角色擁有的 Permission ID
 *
 * Redis 有資料直接使用，
 * Redis 沒資料則從 DB 查詢並寫入 Redis。
 */
export const getRolePermissions = async (roleId: string): Promise<number[]> => {
  const key = getRolePermissionKey(roleId);

  // 1. 先從 Redis 取得
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

  // 3. 取得角色擁有的 Permission ID
  const permissionIds = role.rolePermissions.map((rolePermission) => rolePermission.permissionId);

  // 4. 寫入 Redis，1 小時後過期
  await redisInstance.client.set(key, JSON.stringify(permissionIds), "EX", 3600);

  return permissionIds;
};

/**
 * 清除角色權限 Redis 快取
 */
export const invalidateRolePermissions = async (roleId: string): Promise<void> => {
  const key = getRolePermissionKey(roleId);

  await redisInstance.client.del(key);
};
