// src/controllers/role.controller.ts

import { plainToInstance } from "class-transformer";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import {
  CreateRoleRequestDto,
  GetRoleListRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import type { RoleService } from "../services/role.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

/**
 * Role Controller
 */
export class RoleController implements IController {
  public path = "/roles";
  public router = Router();

  constructor(private readonly roleService: RoleService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.use(authMiddleware);
    this.router.get(
      "/",
      validationMiddleware(GetRoleListRequestDto, "query"),
      this.getRoles,
    );
    this.router.get("/:id", this.getRoleById);
    this.router.post(
      "/",
      validationMiddleware(CreateRoleRequestDto),
      this.createRole,
    );
    this.router.put(
      "/:id",
      validationMiddleware(UpdateRoleRequestDto),
      this.updateRole,
    );
    this.router.delete("/:id", this.deleteRole);
  }

  /**
   * 建立角色
   */
  private createRole = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateRoleRequestDto, req.body);

    const result = await this.roleService.createRole(dto);

    R.success(res, result);
  };

  /**
   * 取得角色列表
   */
  private getRoles = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(GetRoleListRequestDto, req.query);

    const result = await this.roleService.getRoles(dto);

    R.success(res, result);
  };

  /**
   * 取得單一角色
   */
  private getRoleById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const result = await this.roleService.getRoleById(req.params.id);

    R.success(res, result);
  };

  /**
   * 更新角色
   */
  private updateRole = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const dto = plainToInstance(UpdateRoleRequestDto, req.body);

    await this.roleService.updateRole(req.params.id, dto);

    R.success(res);
  };

  /**
   * 刪除角色
   */
  private deleteRole = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    await this.roleService.deleteRole(req.params.id);

    R.success(res);
  };
}
