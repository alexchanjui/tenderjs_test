// src/controllers/user.controller.ts
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
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
    this.router.get(
      "/",
      validationMiddleware(GetUserListRequestDto, "query"),
      this.getUsers,
    );
    this.router.post("/", validationMiddleware(CreateUserDto), this.createUser);
  }

  /**
   * 建立使用者
   */
  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.userService.createUser(req.body);

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 取得使用者列表
   */
  private getUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = res.locals.query;

      const result = await this.userService.getUsers(dto);

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
