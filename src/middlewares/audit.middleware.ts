// src/middlewares/audit.middleware.ts
import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import prismaInstance from "../utils/prisma";
import { requestContextStorage } from "../utils/request-context";

/**
 * API 稽核日誌 Middleware
 */
export const auditLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // 1. 紀錄 API 開始時間
  const startTime = Date.now();

  // 2. 保存原本的 Response send
  const originalSend = res.send;

  let responseBody: unknown = null;

  // 3. 攔截 Response Body
  res.send = function (body): Response {
    responseBody = body;

    return originalSend.call(this, body);
  };

  // 4. Response 完成後寫入 AuditLog
  res.on("finish", async () => {
    try {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // 取得目前登入者
      const currentUser = requestContextStorage.getStore();
      const userId = currentUser?.id ?? null;

      // Request Body
      const reqBody = {
        ...req.body,
      };

      // 敏感資料遮蔽
      if (reqBody.password) {
        reqBody.password = "********";
      }

      if (reqBody.newPassword) {
        reqBody.newPassword = "********";
      }

      const reqData = {
        params: req.params,
        query: req.query,
        body: reqBody,
      };

      // Response Data
      let resData: unknown = responseBody;
      let bizCode = 0;

      if (typeof responseBody === "string") {
        try {
          const parsed = JSON.parse(responseBody);

          resData = parsed;

          if (
            parsed &&
            typeof parsed === "object" &&
            "code" in parsed &&
            typeof parsed.code === "number"
          ) {
            bizCode = parsed.code;
          }
        } catch {
          // 非 JSON 字串則維持原內容
        }
      } else if (
        responseBody &&
        typeof responseBody === "object" &&
        "code" in responseBody &&
        typeof responseBody.code === "number"
      ) {
        bizCode = responseBody.code;
      }

      const responseString =
        resData !== undefined ? JSON.stringify(resData) : null;

      const isSuccess = statusCode >= 200 && statusCode < 400 && bizCode === 0;

      // 5. 寫入 DB
      await prismaInstance.client.auditLog.create({
        data: {
          userId,
          action: `${req.method} ${req.originalUrl.split("?")[0]}`,
          ipAddress: req.ip ?? req.socket.remoteAddress ?? null,
          statusCode,
          bizCode,
          reqData: JSON.stringify(reqData),
          resData: responseString,
          duration,
          isSuccess,
        },
      });
    } catch (error) {
      // Audit Log 寫入失敗不可影響原本 API
      logger.error("[AuditLog] 寫入失敗", error);
    }
  });

  next();
};
