// src/caches/rolePermission.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

const getKey = (roleId: string): string => `role:permissions:v1:${roleId.toLowerCase()}`;

export const getRolePermissionIds = async (roleId: string): Promise<number[]> => {
  const key = getKey(roleId);
  const cached = await redisInstance.client.get(key);

  if (cached) return JSON.parse(cached) as number[];

  const rows = await prismaInstance.client.rolePermission.findMany({
    where: { roleId },
    select: { permissionId: true },
  });

  const ids = rows.map((row) => row.permissionId);
  await redisInstance.client.set(key, JSON.stringify(ids), "EX", 3600);
  return ids;
};

export const invalidateRolePermissions = async (roleId: string): Promise<void> => {
  await redisInstance.client.del(getKey(roleId));
};
