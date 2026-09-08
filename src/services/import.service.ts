// src/services/import.service.ts
import ExcelJS from "exceljs";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { ImportErrorDto, ImportResultDto } from "../dtos/import.dto";
import { SaveStopRequestDto } from "../dtos/stop.dto";
import { Prisma } from "@prisma/client";
import { IServiceContext } from "../types/service.context";

export class ImportService {
  constructor(private readonly ctx: IServiceContext) {}

  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;
    if (!currentUser) throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    return currentUser;
  }

  /**
   * 匯入招呼站資料
   */
  public async importStops(fileBuffer: Buffer): Promise<ImportResultDto> {
    const currentUser = this.getCurrentUser();

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(fileBuffer as unknown as ExcelJS.Buffer);
    } catch {
      throw new AppError(ErrorCode.REQUEST_DATA, "無法讀取 Excel 檔案");
    }

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      throw new AppError(ErrorCode.REQUEST_DATA, "Excel 檔案中找不到工作表");
    }

    const errors: ImportErrorDto[] = [];
    const validData: Prisma.StopCreateManyInput[] = [];

    const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      const data = {
        bvStopCode: row.getCell(1).text.trim(),
        opStopCode: row.getCell(2).text.trim(),
        fullName: row.getCell(3).text.trim(),
        name: row.getCell(4).text.trim(),
        gpsX: row.getCell(5).text.trim(),
        gpsY: row.getCell(6).text.trim(),
        gps2X: row.getCell(7).text.trim(),
        gps2Y: row.getCell(8).text.trim(),
        gpsMemo: row.getCell(9).text.trim(),
        freeBusAreaCode: row.getCell(10).text.trim(),
      };

      // 空白列跳過
      if (!data.bvStopCode && !data.opStopCode && !data.name) {
        continue;
      }

      const dto = plainToInstance(SaveStopRequestDto, data);

      const validationErrors = await validate(dto);

      if (validationErrors.length > 0) {
        const message = validationErrors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .join("、");

        errors.push({
          row: rowNumber,
          message,
        });

        continue;
      }

      validData.push({
        ...dto,
        updateUserId: currentUser.id,
      });
    }

    let successCount = 0;

    if (validData.length > 0) {
      const result = await this.ctx.repos.stop.createMany(validData);
      successCount = result.count;
    }

    return {
      totalCount: validData.length + errors.length,
      successCount,
      failedCount: errors.length,
      errors,
    };
  }
}
