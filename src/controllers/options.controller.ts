// src/controllers/options.controller.ts
import { Router } from "express";
import type { Request, Response } from "express";
import type { OptionsService } from "../services/options.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class OptionsController implements IController {
  public path = "/options";
  public router = Router();

  constructor(private readonly optionsService: OptionsService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/roles", this.getRoleOptions);
    this.router.get("/page-groups", this.getPageGroupOptions);
  }

  /**
   * 取得角色選項
   */
  private getRoleOptions = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.optionsService.getRoleOptions();

    R.success(res, result);
  };

  /**
   * 取得頁面群組選項
   */
  private getPageGroupOptions = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.optionsService.getPageGroupOptions();

    R.success(res, result);
  };
}
