// src/controllers/role.controller.ts
import { plainToInstance } from "class-transformer";
import { Router } from "express";
import type { Request, Response } from "express";
import {
  CreateRoleRequestDto,
  UpdateRolePagesRequestDto,
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
      "/:id/pages",
      validationMiddleware(UpdateRolePagesRequestDto),
      this.updateRolePages,
    );
    this.router.put(
      "/:id/permissions",
      validationMiddleware(UpdateRolePermissionsRequestDto),
      this.updateRolePermissions,
    );
  }

  private createRole = async (req: Request, res: Response): Promise<void> => {
    const result = await this.roleService.createRole(
      plainToInstance(CreateRoleRequestDto, req.body),
    );
    R.success(res, result);
  };

  private getRoles = async (req: Request, res: Response): Promise<void> => {
    const result = await this.roleService.getRoles(
      plainToInstance(PaginationRequestDto, req.query),
    );
    R.success(res, result);
  };

  private getRoleById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    R.success(res, await this.roleService.getRoleById(req.params.id));
  };

  private updateRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.roleService.updateRole(
      req.params.id,
      plainToInstance(UpdateRoleRequestDto, req.body),
    );
    R.success(res);
  };

  private batchDeleteRole = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(BatchDeleteStringIdsDto, req.body);
    await this.roleService.batchDeleteRole(dto.ids);
    R.success(res);
  };

  private updateRolePages = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.roleService.updateRolePages(
      req.params.id,
      plainToInstance(UpdateRolePagesRequestDto, req.body),
    );
    R.success(res);
  };

  private updateRolePermissions = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    await this.roleService.updateRolePermissions(
      req.params.id,
      plainToInstance(UpdateRolePermissionsRequestDto, req.body),
    );
    R.success(res);
  };
}
