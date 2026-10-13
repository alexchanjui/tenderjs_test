// src/controllers/vendor.controller.ts
import { plainToInstance } from "class-transformer";
import { Request, Response, Router } from "express";
import { BatchDeleteStringIdsDto } from "../dtos/common.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import {
  CreateVendorRequestDto,
  UpdateVendorRequestDto,
  UpdateVendorPagesRequestDto,
} from "../dtos/vendor.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { VendorService } from "../services/vendor.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class VendorController implements IController {
  public path = "/vendors";
  public router = Router();

  constructor(private readonly vendorService: VendorService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getVendors);
    this.router.get("/:id", this.getVendorById);
    this.router.post("/", validationMiddleware(CreateVendorRequestDto), this.createVendor);
    this.router.put("/:id", validationMiddleware(UpdateVendorRequestDto), this.updateVendor);
    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteStringIdsDto),
      this.batchDeleteVendor,
    );
    this.router.put(
      "/:id/pages",
      validationMiddleware(UpdateVendorPagesRequestDto),
      this.updateVendorPages,
    );
  }

  /**
   * 建立業者
   */
  private createVendor = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateVendorRequestDto, req.body);

    await this.vendorService.createVendor(dto);

    R.success(res);
  };

  /**
   * 取得業者列表
   */
  private getVendors = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.vendorService.getVendors(dto);

    R.success(res, result);
  };

  /**
   * 取得業者詳細資訊
   */
  private getVendorById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.vendorService.getVendorById(id);

    R.success(res, result);
  };

  /**
   * 更新業者
   */
  private updateVendor = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const dto = plainToInstance(UpdateVendorRequestDto, req.body);

    await this.vendorService.updateVendor(id, dto);

    R.success(res);
  };

  /**
   * 批次刪除業者
   */
  private batchDeleteVendor = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteStringIdsDto, req.body);

    await this.vendorService.batchDeleteVendor(dto.ids);

    R.success(res);
  };

  /**
   * 更新業者頁面權限
   */
  private updateVendorPages = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const dto = plainToInstance(UpdateVendorPagesRequestDto, req.body);

    await this.vendorService.updateVendorPages(id, dto.pageCodes);

    R.success(res);
  };
}
