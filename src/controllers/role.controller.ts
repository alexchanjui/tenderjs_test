// src/controllers/role.controller.ts
import { plainToInstance } from "class-transformer";
import { Router } from "express";
import type { Request, Response } from "express";
import {
  CreateRoleRequestDto,
  UpdateRolePermissionsRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import type { RoleService } from "../services/role.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";
import { BatchDeleteStringIdsDto } from "../dtos/common.dto";

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
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getRoles);
    this.router.get("/:id", this.getRoleById);
    this.router.post("/", validationMiddleware(CreateRoleRequestDto), this.createRole);
    this.router.put("/:id", validationMiddleware(UpdateRoleRequestDto), this.updateRole);
    this.router.delete(
      "/batch",
      validationMiddleware(BatchDeleteStringIdsDto),
      this.batchDeleteRole,
    );
    this.router.put(
      "/:id/permissions",
      validationMiddleware(UpdateRolePermissionsRequestDto),
      this.updateRolePermissions,
    );
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
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.roleService.getRoles(dto);

    R.success(res, result);
  };

  /**
   * 取得角色詳細資訊
   */
  private getRoleById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const result = await this.roleService.getRoleById(req.params.id);

    R.success(res, result);
  };

  /**
   * 更新角色
   */
  private updateRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdateRoleRequestDto, req.body);

    await this.roleService.updateRole(req.params.id, dto);

    R.success(res);
  };

  /**
   * 批次刪除角色
   */
  private batchDeleteRole = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteStringIdsDto, req.body);

    await this.roleService.batchDeleteRole(dto.ids);

    R.success(res);
  };

  /**
   * 更新角色權限
   */
  private updateRolePermissions = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const dto = plainToInstance(UpdateRolePermissionsRequestDto, req.body);

    await this.roleService.updateRolePermissions(req.params.id, dto);

    R.success(res);
  };
}
