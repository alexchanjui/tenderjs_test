// src/controllers/user.controller.ts
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { UserService } from "../services/user.service";
import type { IController } from "./interface/controller.interface";
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
    this.router.post("/", this.createUser);
    this.router.get("/me", this.getMyUserInfo);
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
      const user = await this.userService.createUser(req.body);

      R.success(res, user, "註冊成功");
    } catch (error) {
      next(error);
    }
  };

  /**
   * 取得目前登入使用者資訊
   */
  private getMyUserInfo = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.userService.getMyUser();

      R.success(res, user);
    } catch (error) {
      next(error);
    }
  };
}
