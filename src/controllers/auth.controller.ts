// src/controllers/auth.controller.ts
import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { LoginRequestDto } from "../dtos/auth.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import type { AuthService } from "../services/auth.service";
import * as R from "../utils/response";
import type { IController } from "./interface/controller.interface";

/**
 * Auth Controller
 */
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
    this.router.post(
      "/login",
      validationMiddleware(LoginRequestDto),
      this.login,
    );
  }

  /**
   * 使用者登入
   */
  private login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      R.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
