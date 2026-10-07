// src/controllers/page.controller.ts
import { plainToInstance } from "class-transformer";
import { Request, Response, Router } from "express";
import { BatchDeleteNumberIdsDto } from "../dtos/common.dto";
import { CreatePageRequestDto, UpdatePageRequestDto } from "../dtos/page.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PageService } from "../services/page.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class PageController implements IController {
  public path = "/pages";
  public router = Router();

  constructor(private readonly pageService: PageService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getPages);
    this.router.get("/:id", this.getPageById);
    this.router.post("/", validationMiddleware(CreatePageRequestDto), this.createPage);
    this.router.put("/:id", validationMiddleware(UpdatePageRequestDto), this.updatePage);
    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteNumberIdsDto),
      this.batchDeletePage,
    );
  }

  /**
   * 建立頁面
   */
  private createPage = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreatePageRequestDto, req.body);

    const result = await this.pageService.createPage(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面列表
   */
  private getPages = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.pageService.getPages(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面詳細資訊
   */
  private getPageById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.pageService.getPageById(Number(id));

    R.success(res, result);
  };

  /**
   * 更新頁面
   */
  private updatePage = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdatePageRequestDto, req.body);

    await this.pageService.updatePage(Number(req.params.id), dto);

    R.success(res);
  };

  /**
   * 批次刪除頁面
   */
  private batchDeletePage = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteNumberIdsDto, req.body);

    await this.pageService.batchDeletePage(dto.ids);

    R.success(res);
  };
}
