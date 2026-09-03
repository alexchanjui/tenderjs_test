// src/controllers/auth.controller.ts
import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { AutoLoginRequestDto, LoginRequestDto } from "../dtos/auth.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import type { AuthService } from "../services/auth.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

export class AuthController implements IController {
  public path = "/auth";
  public router = Router();

  constructor(private readonly authService: AuthService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/captcha", this.getCaptcha);
    this.router.post("/login", validationMiddleware(LoginRequestDto), this.login);
    this.router.post("/auto-login", validationMiddleware(AutoLoginRequestDto), this.autoLogin);
  }

  /**
   * 使用者登入
   */
  private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 自動登入（開發環境專用）
   */
  private autoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.autoLogin(req.body);

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 取得登入驗證碼
   */
  private getCaptcha = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.generateCaptcha();

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
