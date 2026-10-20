// src/controllers/vendorProfile.controller.ts

import { plainToInstance } from "class-transformer";
import { Request, Response, Router } from "express";
import { UpdateVendorProfileRequestDto } from "../dtos/vendorProfile.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { VendorProfileService } from "../services/vendorProfile.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class VendorProfileController implements IController {
  public path = "/vendor-profile";
  public router = Router();

  constructor(private readonly vendorProfileService: VendorProfileService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", this.getVendorProfile);

    this.router.put(
      "/",
      validationMiddleware(UpdateVendorProfileRequestDto),
      this.updateVendorProfile,
    );
  }

  /**
   * 取得業者詳細資訊
   */
  private getVendorProfile = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;

    const result = await this.vendorProfileService.getVendorProfile(nodeId);

    R.success(res, result);
  };

  /**
   * 更新業者詳細資訊
   */
  private updateVendorProfile = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;

    const dto = plainToInstance(UpdateVendorProfileRequestDto, req.body);

    await this.vendorProfileService.updateVendorProfile(nodeId, dto);

    R.success(res);
  };
}
