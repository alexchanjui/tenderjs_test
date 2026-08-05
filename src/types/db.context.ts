// src/types/db.context.ts
import type { PrismaClient } from "@prisma/client";
import type { LoggerService } from "../utils/logger";

/**
 * Repository 共用依賴
 */
export interface IDbContext {
  prisma: PrismaClient;
  logger: LoggerService;
}
