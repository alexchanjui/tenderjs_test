// src/middlewares/validation.middleware.ts
import type { ClassConstructor } from "class-transformer";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";

/**
 * 驗證 Request Body
 */
export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
): RequestHandler => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = plainToInstance(dtoClass, req.body);

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      });

      if (errors.length > 0) {
        const firstError = errors[0];
        const firstMessage = Object.values(firstError.constraints ?? {})[0];

        throw new AppError(
          ErrorCode.REQUEST_DATA,
          firstMessage ?? "請求參數錯誤",
        );
      }

      req.body = dto;

      next();
    } catch (error) {
      next(error);
    }
  };
};
