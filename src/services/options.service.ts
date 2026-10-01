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
   * 取得頁面功能選項
   */
  public async getFeatureOptions() {
    const features = await this.ctx.repos.feature.findAll();

    return features.map((feature) => ({
      label: feature.name,
      value: feature.featureCode,
    }));
  }
}
