// src/caches/rolePage.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

export interface ICachedRolePage {
  pageId: number;
}

const getRolePageKey = (roleId: string): string => {
  return `role:pages:v3:${roleId.toLowerCase()}`;
};

export const getRolePages = async (roleId: string): Promise<ICachedRolePage[]> => {
  const key = getRolePageKey(roleId);
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as ICachedRolePage[];
  }

  const rolePages = await prismaInstance.client.rolePage.findMany({
    where: { roleId },
    select: { pageId: true },
  });

  await redisInstance.client.set(key, JSON.stringify(rolePages), "EX", 3600);
  return rolePages;
};

export const invalidateRolePages = async (roleId: string): Promise<void> => {
  await redisInstance.client.del(getRolePageKey(roleId));
};

export const invalidateAllRolePages = async (): Promise<void> => {
  const keys = await redisInstance.client.keys("role:pages:v3:*");
  if (keys.length > 0) {
    await redisInstance.client.del(...keys);
  }
};
