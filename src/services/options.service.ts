// src/services/options.service.ts
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class OptionsService {
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
   * 取得角色選項
   */
  public async getRoleOptions() {
    const currentNodeId = this.getCurrentNodeId();
    const roles = await this.ctx.repos.options.findAllRoles(currentNodeId);

    return roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }

  /**
   * 取得頁面選項
   */
  public async getPageOptions() {
    const pages = await this.ctx.repos.options.findAllPages();

    return pages.map((page) => ({
      label: page.name,
      value: page.id,
      pageCode: page.pageCode,
    }));
  }

  /**
   * 取得組織節點選項
   */
  public async getNodeOptions() {
    const nodes = await this.ctx.repos.options.findAllNodes();

    return nodes.map((node) => ({
      label: node.name,
      value: node.id,
      code: node.code,
      type: node.type,
      pageCodes: node.nodePages.map((nodePage) => nodePage.page.pageCode),
    }));
  }

  /**
   * 取得問題分類選項
   */
  public async getFaqCategoryOptions() {
    const currentNodeId = this.getCurrentNodeId();
    const categories = await this.ctx.repos.options.findAllFaqCategories(currentNodeId);

    return categories.map((category) => ({
      label: category.title,
      value: category.id,
    }));
  }
}
