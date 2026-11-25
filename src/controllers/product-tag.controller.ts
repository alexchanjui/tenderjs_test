// src/controllers/product-tag.controller.ts
import type { Request, Response } from "express";
import { Router } from "express";
import { plainToInstance } from "class-transformer";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { CreateProductTagRequestDto, UpdateProductTagRequestDto } from "../dtos/product-tag.dto";
import type { ProductTagService } from "../services/product-tag.service";
import type { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class ProductTagController implements IController {
  public path = "/product-tags";
  public router = Router();

  constructor(private readonly productTagService: ProductTagService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getProductTags);
    this.router.post(
      "/",
      validationMiddleware(CreateProductTagRequestDto, "body"),
      this.createProductTag,
    );
    this.router.put(
      "/:id",
      validationMiddleware(UpdateProductTagRequestDto, "body"),
      this.updateProductTag,
    );
    this.router.delete("/:id", this.deleteProductTag);
  }

  /**
   * 取得商品標籤列表（搜尋、分頁）
   */
  private getProductTags = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.productTagService.getProductTags(dto);

    R.success(res, result);
  };

  /**
   * 建立商品標籤
   */
  private createProductTag = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateProductTagRequestDto, req.body);

    await this.productTagService.createProductTag(dto);

    R.success(res);
  };

  /**
   * 更新商品標籤
   */
  private updateProductTag = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const dto = plainToInstance(UpdateProductTagRequestDto, req.body);

    await this.productTagService.updateProductTag(Number(id), dto);

    R.success(res);
  };

  /**
   * 刪除商品標籤
   */
  private deleteProductTag = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.productTagService.deleteProductTag(Number(id));

    R.success(res);
  };
}
