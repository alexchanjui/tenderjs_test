// src/controllers/user.controller.ts
import { Router } from "express";
import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import type { UserService } from "../services/user.service";
import { UpdateUserRequestDto } from "../dtos/user.dto";
import type { IController } from "./interface/controller.interface";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateUserDto } from "../dtos/user.dto";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import * as R from "../utils/response";

export class UserController implements IController {
  public path = "/users";
  public router = Router();

  constructor(private readonly userService: UserService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.post("/", validationMiddleware(CreateUserDto), this.createUser);
    this.router.get(
      "/",
      validationMiddleware(PaginationRequestDto, "query"),
      this.getUsers,
    );
    this.router.get("/me", this.getMyUserInfo);
    this.router.put(
      "/:id",
      validationMiddleware(UpdateUserRequestDto),
      this.updateUser,
    );
  }

  /**
   * 建立使用者
   */
  private createUser = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateUserDto, req.body);

    const result = await this.userService.createUser(dto);

    R.success(res, result);
  };

  /**
   * 取得當前使用者詳細資料
   */
  private getMyUserInfo = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.userService.getMyUserInfo();

    R.success(res, result);
  };

  /**
   * 取得使用者列表
   */
  private getUsers = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.userService.getUsers(dto);

    R.success(res, result);
  };

  /**
   * 更新使用者
   */
  private updateUser = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const dto = plainToInstance(UpdateUserRequestDto, req.body);

    await this.userService.updateUser(req.params.id, dto);

    R.success(res);
  };
}
