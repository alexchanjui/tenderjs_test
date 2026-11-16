// src/controllers/product-category.controller.ts
import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import {
  UpdateProductCategoryRequestDto,
  CreateProductCategoryRequestDto,
} from "../dtos/product-category.dto";
import { ProductCategoryService } from "../services/product-category.service";
import { BatchDeleteNumberIdsDto } from "../dtos/common.dto";
import type { IController } from "./interface/controller.interface";
import { Router } from "express";
import * as R from "../utils/response";

export class ProductCategoryController implements IController {
  public path = "/product-category";
  public router = Router();

  constructor(private readonly productCategoryService: ProductCategoryService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      validationMiddleware(PaginationRequestDto, "query"),
      this.getProductCategoryList,
    );
    this.router.get("/:id", this.getProductCategoryById);
    this.router.post(
      "/",
      validationMiddleware(UpdateProductCategoryRequestDto, "body"),
      this.createProductCategory,
    );
    this.router.put(
      "/:id",
      validationMiddleware(UpdateProductCategoryRequestDto, "body"),
      this.updateProductCategory,
    );
    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteNumberIdsDto),
      this.batchDeleteProductCategory,
    );
  }

  private getProductCategoryList = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.productCategoryService.getProductCategoryList(dto);

    R.success(res, result);
  };

  private createProductCategory = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateProductCategoryRequestDto, req.body);

    const result = await this.productCategoryService.createProductCategory(dto);

    R.success(res, result);
  };

  private getProductCategoryById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.productCategoryService.getProductCategoryById(Number(id));

    R.success(res, result);
  };

  private updateProductCategory = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const dto = plainToInstance(UpdateProductCategoryRequestDto, req.body);

    await this.productCategoryService.updateProductCategory(Number(id), dto);

    R.success(res);
  };

  private batchDeleteProductCategory = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteNumberIdsDto, req.body);

    await this.productCategoryService.batchDeleteProductCategory(dto.ids);

    R.success(res);
  };
}
