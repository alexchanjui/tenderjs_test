// src/services/export.service.ts
import ExcelJS from "exceljs";
import { IServiceContext } from "../types/service.context";

export class ExportService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 匯出招呼站資料
   */
  public async exportStops(): Promise<ExcelJS.Workbook> {
    const stops = await this.ctx.repos.stop.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("招呼站");

    worksheet.columns = [
      { header: "票機招呼站代碼", key: "bvStopCode", width: 18 },
      { header: "業者招呼站代碼", key: "opStopCode", width: 18 },
      { header: "招呼站全名", key: "fullName", width: 24 },
      { header: "招呼站名稱", key: "name", width: 20 },
      { header: "經度", key: "gpsX", width: 16 },
      { header: "緯度", key: "gpsY", width: 16 },
      { header: "經度2", key: "gps2X", width: 16 },
      { header: "緯度2", key: "gps2Y", width: 16 },
      { header: "GPS備註", key: "gpsMemo", width: 24 },
      { header: "免費公車區碼", key: "freeBusAreaCode", width: 18 },
    ];

    stops.forEach((stop) => {
      worksheet.addRow({
        bvStopCode: stop.bvStopCode,
        opStopCode: stop.opStopCode,
        fullName: stop.fullName,
        name: stop.name,
        gpsX: stop.gpsX,
        gpsY: stop.gpsY,
        gps2X: stop.gps2X,
        gps2Y: stop.gps2Y,
        gpsMemo: stop.gpsMemo,
        freeBusAreaCode: stop.freeBusAreaCode,
      });
    });

    // 標題列樣式
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    headerRow.height = 24;

    return workbook;
  }
}
