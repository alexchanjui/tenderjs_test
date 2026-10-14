// src/services/options.service.ts
import type { IServiceContext } from "../types/service.context";

export class OptionsService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得角色選項
   */
  public async getRoleOptions() {
    const roles = await this.ctx.repos.options.findAllRoles();

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
    }));
  }
}
