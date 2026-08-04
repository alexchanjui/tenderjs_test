// src/types/service.context.ts
import type { PrismaClient } from "@prisma/client";
import type Redis from "ioredis";
import type { LoggerService } from "../utils/logger";

/**
 * Service 共用依賴
 */
export interface IServiceContext {
  logger: LoggerService;
  prisma: PrismaClient;
  redis: Redis;
}
