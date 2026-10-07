// src/services/options.service.ts
import type { IServiceContext } from "../types/service.context";

export class OptionsService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得角色選項
   */
  public async getRoleOptions() {
    const roles = await this.ctx.repos.role.findAll();

    return roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }

  /**
   * 取得頁面群組選項
   */
  public async getPageGroupOptions() {
    const pageGroups = await this.ctx.repos.pageGroup.findAll();

    return pageGroups.map((pageGroup) => ({
      label: pageGroup.name,
      value: pageGroup.pageGroupCode,
    }));
  }
}
