// src/controllers/health.controller.ts
import { Router } from "express";
import type { Request, Response } from "express";
import type { HealthService } from "../services/health.service";
import type { IController } from "./interface/controller.interface";

/**
 * 系統健康檢查 Controller
 */
export class HealthController implements IController {
  public path = "/health";
  public router = Router();

  constructor(private readonly healthService: HealthService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", this.check);
  }

  /**
   * 健康檢查
   */
  private check = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.healthService.checkHealth();

    res.status(result.status === "UP" ? 200 : 503).json(result);
  };
}
