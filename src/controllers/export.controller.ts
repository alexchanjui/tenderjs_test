// src/controllers/export.controller.ts
import { Router } from "express";
import type { Request, Response } from "express";
import type { Workbook } from "exceljs";
import type { ExportService } from "../services/export.service";
import { IController } from "./interface/controller.interface";

export class ExportController implements IController {
  public path = "/export";
  public router = Router();

  constructor(private readonly exportService: ExportService) {
    this.initializeRoutes();
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    this.router.get("/stops", this.exportStops);
  }

  /**
   * 回傳 Excel
   */
  private sendExcelResponse = async (
    res: Response,
    workbook: Workbook,
    fileNamePrefix: string,
  ): Promise<void> => {
    const date = new Date().toISOString().split("T")[0];
    const fileName = `${fileNamePrefix}_${date}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);

    res.end();
  };

  /**
   * 匯出招呼站資料
   */
  private exportStops = async (_req: Request, res: Response): Promise<void> => {
    const workbook = await this.exportService.exportStops();

    await this.sendExcelResponse(res, workbook, "Stops");
  };
}
