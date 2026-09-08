// src/controllers/import.controller.ts
import multer from "multer";
import { Router } from "express";
import type { Request, Response } from "express";
import { IController } from "./interface/controller.interface";
import type { ImportService } from "../services/import.service";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import * as R from "../utils/response";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
});

export class ImportController implements IController {
  public path = "/import";
  public router = Router();

  constructor(private readonly importService: ImportService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.post("/stops", upload.single("file"), this.importStops);
  }

  /**
   * 匯入招呼站資料
   */
  private importStops = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError(ErrorCode.REQUEST_DATA, "請上傳檔案");
    }

    const result = await this.importService.importStops(req.file.buffer);

    R.success(res, result);
  };
}
