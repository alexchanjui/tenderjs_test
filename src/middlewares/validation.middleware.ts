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
export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  target: ValidationTarget = "body",
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req[target]);

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      });

      if (errors.length > 0) {
        throw new AppError(
          ErrorCode.REQUEST_DATA,
          Object.values(errors[0].constraints ?? {})[0],
        );
      }

      res.locals[target] = dto;

      next();
    } catch (error) {
      next(error);
    }
  };
};
