// src/controllers/vendor.controller.ts
import { plainToInstance } from "class-transformer";
import { Router } from "express";
import type { Request, Response } from "express";
import { BatchDeleteStringIdsDto } from "../dtos/common.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import {
  CreateVendorRequestDto,
  UpdateVendorPermissionsRequestDto,
  UpdateVendorRequestDto,
} from "../dtos/vendor.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import type { VendorService } from "../services/vendor.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class VendorController implements IController {
  public path = "/vendors";
  public router = Router();

  constructor(private readonly vendorService: VendorService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getVendors);
    this.router.post("/", validationMiddleware(CreateVendorRequestDto), this.createVendor);

    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteStringIdsDto),
      this.batchDeleteVendor,
    );

    this.router.get("/:id/permissions", this.getVendorPermissions);
    this.router.put(
      "/:id/permissions",
      validationMiddleware(UpdateVendorPermissionsRequestDto),
      this.updateVendorPermissions,
    );

    this.router.get("/:id", this.getVendorById);
    this.router.put("/:id", validationMiddleware(UpdateVendorRequestDto), this.updateVendor);
  }

  private createVendor = async (req: Request, res: Response): Promise<void> => {
    const result = await this.vendorService.createVendor(
      plainToInstance(CreateVendorRequestDto, req.body),
    );
    R.success(res, result);
  };

  private getVendors = async (req: Request, res: Response): Promise<void> => {
    const result = await this.vendorService.getVendors(
      plainToInstance(PaginationRequestDto, req.query),
    );
    R.success(res, result);
  };

  private getVendorById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    R.success(res, await this.vendorService.getVendorById(req.params.id));
  };

  private updateVendor = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.vendorService.updateVendor(
      req.params.id,
      plainToInstance(UpdateVendorRequestDto, req.body),
    );
    R.success(res);
  };

  private batchDeleteVendor = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteStringIdsDto, req.body);
    await this.vendorService.batchDeleteVendor(dto.ids);
    R.success(res);
  };

  private getVendorPermissions = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    R.success(res, await this.vendorService.getVendorPermissions(req.params.id));
  };

  private updateVendorPermissions = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    await this.vendorService.updateVendorPermissions(
      req.params.id,
      plainToInstance(UpdateVendorPermissionsRequestDto, req.body),
    );
    R.success(res);
  };
}
