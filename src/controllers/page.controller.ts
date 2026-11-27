// src/controllers/page.controller.ts
import { plainToInstance } from "class-transformer";
import { Router, type Request, type Response } from "express";
import { CreatePageRequestDto, UpdatePageRequestDto } from "../dtos/page.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PageService } from "../services/page.service";
import type { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class PageController implements IController {
  public path = "/pages";
  public router = Router();

  constructor(private readonly pageService: PageService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getPages);
    this.router.post("/", validationMiddleware(CreatePageRequestDto, "body"), this.createPage);
    this.router.put("/:id", validationMiddleware(UpdatePageRequestDto, "body"), this.updatePage);
    this.router.delete("/:id", this.deletePage);
  }

  /**
   * 取得頁面列表
   */
  private getPages = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.pageService.getPages(dto);

    R.success(res, result);
  };

  /**
   * 建立頁面
   */
  private createPage = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreatePageRequestDto, req.body);

    await this.pageService.createPage(dto);

    R.success(res);
  };

  /**
   * 更新頁面
   */
  private updatePage = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdatePageRequestDto, req.body);

    await this.pageService.updatePage(Number(req.params.id), dto);

    R.success(res);
  };

  /**
   * 刪除頁面
   */
  private deletePage = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.pageService.deletePage(Number(req.params.id));

    R.success(res);
  };
}
