// src/controllers/permission.controller.ts
import { Request, Response, Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { plainToInstance } from "class-transformer";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { PermissionService } from "../services/permission.service";
import { CreatePermissionRequestDto, UpdatePermissionRequestDto } from "../dtos/permission.dto";
import type { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class PermissionController implements IController {
  public path = "/permissions";
  public router = Router();

  constructor(private readonly permissionService: PermissionService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getPermissions);
    this.router.get("/:id", this.getPermissionById);
    this.router.post("/", validationMiddleware(CreatePermissionRequestDto), this.createPermission);
    this.router.put(
      "/:id",
      validationMiddleware(UpdatePermissionRequestDto),
      this.updatePermission,
    );
    this.router.delete("/:id", this.deletePermission);
  }

  /**
   * 建立權限
   */
  private createPermission = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreatePermissionRequestDto, req.body);

    const result = await this.permissionService.createPermission(dto);

    R.success(res, result);
  };

  /**
   * 取得權限列表
   */
  private getPermissions = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.permissionService.getPermissions(dto);

    R.success(res, result);
  };

  /**
   * 取得權限詳細資訊
   */
  private getPermissionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.permissionService.getPermissionById(Number(id));

    R.success(res, result);
  };

  /**
   * 更新權限
   */
  private updatePermission = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(UpdatePermissionRequestDto, req.body);

    await this.permissionService.updatePermission(Number(req.params.id), dto);

    R.success(res);
  };

  /**
   * 刪除權限
   */
  private deletePermission = async (req: Request, res: Response): Promise<void> => {
    await this.permissionService.deletePermission(Number(req.params.id));

    R.success(res);
  };
}
