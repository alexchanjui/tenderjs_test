// src/controllers/feature.controller.ts
import { Request, Response, Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { plainToInstance } from "class-transformer";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { FeatureService } from "../services/feature.service";
import { CreateFeatureRequestDto, UpdateFeatureRequestDto } from "../dtos/feature.dto";
import { BatchDeleteNumberIdsDto } from "../dtos/common.dto";
import type { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class FeatureController implements IController {
  public path = "/features";
  public router = Router();

  constructor(private readonly featureService: FeatureService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getFeatures);
    this.router.get("/:featureCode", this.getFeatureByCode);
    this.router.post("/", validationMiddleware(CreateFeatureRequestDto), this.createFeature);
    this.router.put(
      "/:featureCode",
      validationMiddleware(UpdateFeatureRequestDto),
      this.updateFeature,
    );
    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteNumberIdsDto),
      this.batchDeleteFeature,
    );
  }

  /**
   * 建立頁面功能
   */
  private createFeature = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateFeatureRequestDto, req.body);

    const result = await this.featureService.createFeature(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面功能列表
   */
  private getFeatures = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.featureService.getFeatures(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面功能詳細資訊
   */
  private getFeatureByCode = async (req: Request, res: Response): Promise<void> => {
    const { featureCode } = req.params;

    const result = await this.featureService.getFeatureByCode(Number(featureCode));

    R.success(res, result);
  };

  /**
   * 更新頁面功能
   */
  private updateFeature = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdateFeatureRequestDto, req.body);

    await this.featureService.updateFeature(Number(req.params.featureCode), dto);

    R.success(res);
  };

  /**
   * 批次刪除頁面功能
   */
  private batchDeleteFeature = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteNumberIdsDto, req.body);

    await this.featureService.batchDeleteFeature(dto.ids);

    R.success(res);
  };
}
