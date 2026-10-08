// src/caches/vendorPermission.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

const getKey = (vendorId: string): string => `vendor:permissions:v1:${vendorId.toLowerCase()}`;

export const getVendorPermissionIds = async (vendorId: string): Promise<number[]> => {
  const key = getKey(vendorId);
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as number[];
  }

  const rows = await prismaInstance.client.vendorPermission.findMany({
    where: { vendorId },
    select: { permissionId: true },
  });

  const ids = rows.map((row) => row.permissionId);

  await redisInstance.client.set(key, JSON.stringify(ids), "EX", 3600);

  return ids;
};

export const invalidateVendorPermissions = async (vendorId: string): Promise<void> => {
  await redisInstance.client.del(getKey(vendorId));
};
