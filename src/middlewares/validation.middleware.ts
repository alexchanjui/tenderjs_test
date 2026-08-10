// src/middlewares/validation.middleware.ts
import { plainToInstance, type ClassConstructor } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";

type ValidationTarget = "body" | "query" | "params";

/**
 * DTO 驗證 Middleware
 */
export const validationMiddleware = (
  dtoClass: ClassConstructor<object>,
  target: ValidationTarget = "body",
): RequestHandler => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const source = req[target];

      if (!source) {
        throw new AppError(ErrorCode.REQUEST_DATA, "請求參數不可為空");
      }

      const dto = plainToInstance(dtoClass, source);

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      });

      if (errors.length > 0) {
        throw new AppError(
          ErrorCode.REQUEST_DATA,
          Object.values(errors[0].constraints ?? {})[0] ?? "請求參數錯誤",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
