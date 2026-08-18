// src/controllers/user.controller.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import type { UserService } from "../services/user.service";
import type { IController } from "./interface/controller.interface";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateUserDto, GetUserListRequestDto } from "../dtos/user.dto";
import * as R from "../utils/response";

/**
 * User Controller
 */
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

    this.router.use(authMiddleware);
    this.router.get(
      "/",
      validationMiddleware(GetUserListRequestDto, "query"),
      this.getUsers,
    );
    this.router.get("/me", this.getMyUserInfo);
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
   * 取得目前登入使用者資訊
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
    const dto = plainToInstance(GetUserListRequestDto, req.query);

    const result = await this.userService.getUsers(dto);

    R.success(res, result);
  };
}
