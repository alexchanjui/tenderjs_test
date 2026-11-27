// src/controllers/product-category.controller.ts
import { Router, type Request, type Response } from "express";
import { plainToInstance } from "class-transformer";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import {
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from "../dtos/product-category.dto";
import { ProductCategoryService } from "../services/product-category.service";
import type { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class ProductCategoryController implements IController {
  public path = "/product-categories";
  public router = Router();

  constructor(private readonly productCategoryService: ProductCategoryService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      validationMiddleware(PaginationRequestDto, "query"),
      this.getProductCategories,
    );
    this.router.post(
      "/",
      validationMiddleware(CreateProductCategoryRequestDto, "body"),
      this.createProductCategory,
    );
    this.router.put(
      "/:id",
      validationMiddleware(UpdateProductCategoryRequestDto, "body"),
      this.updateProductCategory,
    );
    this.router.delete("/:id", this.deleteProductCategory);
  }

  private getProductCategories = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.productCategoryService.getProductCategories(dto);

    R.success(res, result);
  };

  private createProductCategory = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateProductCategoryRequestDto, req.body);

    await this.productCategoryService.createProductCategory(dto);

    R.success(res);
  };

  private updateProductCategory = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const dto = plainToInstance(UpdateProductCategoryRequestDto, req.body);

    await this.productCategoryService.updateProductCategory(Number(req.params.id), dto);

    R.success(res);
  };

  private deleteProductCategory = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    await this.productCategoryService.deleteProductCategory(Number(req.params.id));

    R.success(res);
  };
}
