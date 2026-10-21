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
   * 取得目前登入使用者
   */
  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentUser;
  }

  /**
   * 取得實際操作的 Node ID
   */
  private getTargetNodeId(nodeId?: string): string {
    const currentUser = this.getCurrentUser();

    // 業者只能操作自己的資料
    if (currentUser.nodeType === "VENDOR") {
      return currentUser.nodeId;
    }

    // 營運可指定 Node，未指定則操作自己的 Node
    return nodeId ?? currentUser.nodeId;
  }

  /**
   * 取得業者詳細資訊
   */
  private async getVendorProfile(nodeId?: string) {
    const targetNodeId = this.getTargetNodeId(nodeId);

    const profile = await this.ctx.repos.vendorProfile.findByNodeId(targetNodeId);

    if (!profile) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者資料不存在");
    }

    return profile;
  }

  /**
   * 檢查問答分類操作權限
   */
  private async validateCategoryAccess(id: string) {
    const category = await this.ctx.repos.faq.findCategoryById(id);

    if (!category) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答分類不存在");
    }

    const currentUser = this.getCurrentUser();

    if (currentUser.nodeType === "VENDOR") {
      const profile = await this.ctx.repos.vendorProfile.findByNodeId(currentUser.nodeId);

      if (!profile || category.vendorProfileId !== profile.id) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答分類不存在");
      }
    }

    return category;
  }

  /**
   * 檢查問答操作權限
   */
  private async validateQaAccess(id: string) {
    const qa = await this.ctx.repos.faq.findQaById(id);

    if (!qa) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答不存在");
    }

    const currentUser = this.getCurrentUser();

    if (currentUser.nodeType === "VENDOR") {
      const profile = await this.ctx.repos.vendorProfile.findByNodeId(currentUser.nodeId);
      const category = await this.ctx.repos.faq.findCategoryById(qa.categoryId);

      if (!profile || !category || category.vendorProfileId !== profile.id) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答不存在");
      }
    }

    return qa;
  }

  /**
   * 取得問答分類列表
   */
  public async getCategories(nodeId?: string): Promise<FaqCategoryResponseDto[]> {
    const profile = await this.getVendorProfile(nodeId);

    const categories = await this.ctx.repos.faq.findAllCategories(profile.id);

    return plainToInstance(FaqCategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 新增問答分類
   */
  public async createCategory(data: CreateFaqCategoryRequestDto): Promise<void> {
    const profile = await this.getVendorProfile(data.nodeId);

    await this.ctx.repos.faq.createCategory(profile.id, data);
  }

  /**
   * 更新問答分類
   */
  public async updateCategory(id: string, data: UpdateFaqCategoryRequestDto): Promise<void> {
    await this.validateCategoryAccess(id);

    await this.ctx.repos.faq.updateCategory(id, data);
  }

  /**
   * 刪除問答分類
   */
  public async deleteCategory(id: string): Promise<void> {
    await this.validateCategoryAccess(id);

    await this.ctx.repos.faq.deleteCategory(id);
  }

  /**
   * 取得問答列表
   */
  public async getQaList(categoryId: string, nodeId?: string): Promise<FaqResponseDto[]> {
    const profile = await this.getVendorProfile(nodeId);
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
    const profile = await this.getVendorProfile(data.nodeId);
    const category = await this.ctx.repos.faq.findCategoryById(data.categoryId);

    if (!category || category.vendorProfileId !== profile.id) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答分類不存在");
    }

    await this.ctx.repos.faq.createQa(data);
  }

  /**
   * 更新問答
   */
  public async updateQa(id: string, data: UpdateFaqRequestDto): Promise<void> {
    const qa = await this.validateQaAccess(id);

    if (data.categoryId) {
      const category = await this.ctx.repos.faq.findCategoryById(data.categoryId);

      if (!category) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答不存在");
      }

      const currentUser = this.getCurrentUser();

      if (currentUser.nodeType === "VENDOR") {
        const profile = await this.ctx.repos.vendorProfile.findByNodeId(currentUser.nodeId);

        if (!profile || category.vendorProfileId !== profile.id) {
          throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答不存在");
        }
      } else {
        const originalCategory = await this.ctx.repos.faq.findCategoryById(qa.categoryId);

        if (!originalCategory || category.vendorProfileId !== originalCategory.vendorProfileId) {
          throw new AppError(ErrorCode.DATA_NOT_FOUND, "問答不存在");
        }
      }
    }

    await this.ctx.repos.faq.updateQa(id, data);
  }

  /**
   * 刪除問答
   */
  public async deleteQa(id: string): Promise<void> {
    await this.validateQaAccess(id);

    await this.ctx.repos.faq.deleteQa(id);
  }
}
