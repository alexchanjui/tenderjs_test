// src/services/health.service.ts
import type { IServiceContext } from "../types/service.context";

/**
 * 系統健康檢查服務
 */
export class HealthService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 檢查系統健康狀態
   */
  public async checkHealth() {
    let databaseStatus: "CONNECTED" | "DISCONNECTED" = "DISCONNECTED";

    try {
      await this.ctx.prisma.$queryRaw`SELECT 1`;

      databaseStatus = "CONNECTED";
    } catch (error) {
      this.ctx.logger.error("資料庫健康檢查失敗", error);
    }

    const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    return {
      status: databaseStatus === "CONNECTED" ? "UP" : "DEGRADED",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      info: {
        database: databaseStatus,
        memoryUsage: `${memoryUsage} MB`,
        version: process.env.npm_package_version ?? "1.0.0",
      },
    };
  }
}
