import { plainToInstance } from "class-transformer";
import { Request, Response, Router } from "express";
import {
  CreateFaqCategoryRequestDto,
  CreateFaqRequestDto,
  UpdateFaqCategoryRequestDto,
  UpdateFaqRequestDto,
} from "../dtos/faq.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { FaqService } from "../services/faq.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class FaqController implements IController {
  public path = "/";
  public router = Router();

  constructor(private readonly faqService: FaqService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    // 問答分類
    this.router.get("/faq-categories", this.getCategories);
    this.router.post(
      "/faq-categories",
      validationMiddleware(CreateFaqCategoryRequestDto),
      this.createCategory,
    );
    this.router.put(
      "/faq-categories/:id",
      validationMiddleware(UpdateFaqCategoryRequestDto),
      this.updateCategory,
    );
    this.router.delete("/faq-categories/:id", this.deleteCategory);

    // 問答
    this.router.get("/faqs", this.getQaList);
    this.router.post("/faqs", validationMiddleware(CreateFaqRequestDto), this.createQa);
    this.router.put("/faqs/:id", validationMiddleware(UpdateFaqRequestDto), this.updateQa);
    this.router.delete("/faqs/:id", this.deleteQa);
  }

  /**
   * 取得問答分類列表
   */
  private getCategories = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;

    const result = await this.faqService.getCategories(nodeId);

    R.success(res, result);
  };

  /**
   * 新增問答分類
   */
  private createCategory = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;
    const dto = plainToInstance(CreateFaqCategoryRequestDto, req.body);

    await this.faqService.createCategory(nodeId, dto);

    R.success(res);
  };

  /**
   * 更新問答分類
   */
  private updateCategory = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const nodeId = req.query.nodeId as string | undefined;
    const dto = plainToInstance(UpdateFaqCategoryRequestDto, req.body);

    await this.faqService.updateCategory(id, nodeId, dto);

    R.success(res);
  };

  /**
   * 刪除問答分類
   */
  private deleteCategory = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const nodeId = req.query.nodeId as string | undefined;

    await this.faqService.deleteCategory(id, nodeId);

    R.success(res);
  };

  /**
   * 取得問答列表
   */
  private getQaList = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;
    const categoryId = req.query.categoryId as string;

    const result = await this.faqService.getQaList(categoryId, nodeId);

    R.success(res, result);
  };

  /**
   * 新增問答
   */
  private createQa = async (req: Request, res: Response): Promise<void> => {
    const nodeId = req.query.nodeId as string | undefined;
    const dto = plainToInstance(CreateFaqRequestDto, req.body);

    await this.faqService.createQa(nodeId, dto);

    R.success(res);
  };

  /**
   * 更新問答
   */
  private updateQa = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const nodeId = req.query.nodeId as string | undefined;
    const dto = plainToInstance(UpdateFaqRequestDto, req.body);

    await this.faqService.updateQa(id, nodeId, dto);

    R.success(res);
  };

  /**
   * 刪除問答
   */
  private deleteQa = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const nodeId = req.query.nodeId as string | undefined;

    await this.faqService.deleteQa(id, nodeId);

    R.success(res);
  };
}
