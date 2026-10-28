// src/caches/nodePage.cache.ts
import prismaInstance from "../utils/prisma";
import redisInstance from "../utils/redis";

const CACHE_PREFIX = "node:pages:v1:";
const CACHE_TTL = 60 * 60;

/**
 * 取得 Node 頁面權限快取 Key
 */
const getNodePagesKey = (nodeId: string): string => {
  return `${CACHE_PREFIX}${nodeId.toLowerCase()}`;
};

/**
 * 取得 Node 擁有的頁面 ID
 */
export const getNodePageIds = async (nodeId: string): Promise<number[]> => {
  const key = getNodePagesKey(nodeId);
  const cached = await redisInstance.client.get(key);

  if (cached) {
    return JSON.parse(cached) as number[];
  }

  const nodePages = await prismaInstance.client.nodePage.findMany({
    where: {
      nodeId,
      page: {
        isActive: true,
      },
    },
    select: {
      pageId: true,
    },
  });

  const pageIds = nodePages.map((nodePage) => nodePage.pageId);

  await redisInstance.client.set(key, JSON.stringify(pageIds), "EX", CACHE_TTL);

  return pageIds;
};

/**
 * 清除 Node 頁面權限快取
 */
export const invalidateNodePages = async (nodeId: string): Promise<void> => {
  const key = getNodePagesKey(nodeId);

  await redisInstance.client.del(key);
};
