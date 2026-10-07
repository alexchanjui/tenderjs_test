// src/controllers/pageGroup.controller.ts
import { plainToInstance } from "class-transformer";
import { Request, Response, Router } from "express";
import { BatchDeleteNumberIdsDto } from "../dtos/common.dto";
import { CreatePageGroupRequestDto, UpdatePageGroupRequestDto } from "../dtos/pageGroup.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { PageGroupService } from "../services/pageGroup.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class PageGroupController implements IController {
  public path = "/page-groups";
  public router = Router();

  constructor(private readonly pageGroupService: PageGroupService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getPageGroups);

    this.router.get("/:pageGroupCode", this.getPageGroupByCode);

    this.router.post("/", validationMiddleware(CreatePageGroupRequestDto), this.createPageGroup);

    this.router.put(
      "/:pageGroupCode",
      validationMiddleware(UpdatePageGroupRequestDto),
      this.updatePageGroup,
    );

    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteNumberIdsDto),
      this.batchDeletePageGroup,
    );
  }

  /**
   * 建立頁面群組
   */
  private createPageGroup = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreatePageGroupRequestDto, req.body);

    const result = await this.pageGroupService.createPageGroup(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面群組列表
   */
  private getPageGroups = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.pageGroupService.getPageGroups(dto);

    R.success(res, result);
  };

  /**
   * 取得頁面群組詳細資訊
   */
  private getPageGroupByCode = async (req: Request, res: Response): Promise<void> => {
    const { pageGroupCode } = req.params;

    const result = await this.pageGroupService.getPageGroupByCode(Number(pageGroupCode));

    R.success(res, result);
  };

  /**
   * 更新頁面群組
   */
  private updatePageGroup = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdatePageGroupRequestDto, req.body);

    await this.pageGroupService.updatePageGroup(Number(req.params.pageGroupCode), dto);

    R.success(res);
  };

  /**
   * 批次刪除頁面群組
   */
  private batchDeletePageGroup = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteNumberIdsDto, req.body);

    await this.pageGroupService.batchDeletePageGroup(dto.ids);

    R.success(res);
  };
}
