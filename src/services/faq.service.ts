// src/services/faq.service.ts
import { plainToInstance } from "class-transformer";
import {
  CreateFaqCategoryRequestDto,
  CreateFaqRequestDto,
  FaqCategoryResponseDto,
  FaqResponseDto,
  UpdateFaqCategoryRequestDto,
  UpdateFaqRequestDto,
} from "../dtos/faq.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class FaqService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得目前操作的 Node ID
   */
  private getCurrentNodeId(): string {
    const currentNodeId = this.ctx.currentNodeId;

    if (!currentNodeId) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentNodeId;
  }

  /**
   * 取得業者詳細資訊
   */
  private async getVendorProfile() {
    const currentNodeId = this.getCurrentNodeId();
    const profile = await this.ctx.repos.vendorProfile.findByNodeId(currentNodeId);

    if (!profile) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者資料不存在");
    }

    return profile;
  }

  /**
   * 取得問答分類列表
   */
  public async getCategories(): Promise<FaqCategoryResponseDto[]> {
    const profile = await this.getVendorProfile();
    const categories = await this.ctx.repos.faq.findAllCategories(profile.id);

    return plainToInstance(FaqCategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 新增問答分類
   */
  public async createCategory(data: CreateFaqCategoryRequestDto): Promise<void> {
    const profile = await this.getVendorProfile();

    await this.ctx.repos.faq.createCategory(profile.id, data);
  }

  /**
   * 更新問答分類
   */
  public async updateCategory(id: number, data: UpdateFaqCategoryRequestDto): Promise<void> {
    await this.ctx.repos.faq.updateCategory(id, data);
  }

  /**
   * 刪除問答分類
   */
  public async deleteCategory(id: number): Promise<void> {
    await this.ctx.repos.faq.deleteCategory(id);
  }

  /**
   * 取得問答列表
   */
  public async getQaList(categoryId: number): Promise<FaqResponseDto[]> {
    const profile = await this.getVendorProfile();
    const category = await this.ctx.repos.faq.findCategoryById(categoryId);

    if (!category || category.vendorProfileId !== profile.id) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答分類不存在");
    }

    const qaList = await this.ctx.repos.faq.findAllQa(categoryId);

    return plainToInstance(FaqResponseDto, qaList, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 新增問答
   */
  public async createQa(data: CreateFaqRequestDto): Promise<void> {
    const profile = await this.getVendorProfile();
    const category = await this.ctx.repos.faq.findCategoryById(data.categoryId);

    if (!category || category.vendorProfileId !== profile.id) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答分類不存在");
    }

    await this.ctx.repos.faq.createQa(data);
  }

  /**
   * 更新問答
   */
  public async updateQa(id: number, data: UpdateFaqRequestDto): Promise<void> {
    await this.ctx.repos.faq.updateQa(id, data);
  }

  /**
   * 刪除問答
   */
  public async deleteQa(id: number): Promise<void> {
    await this.ctx.repos.faq.deleteQa(id);
  }
}
