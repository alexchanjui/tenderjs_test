// src/controllers/stop.controller.ts

import { Request, Response, Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { plainToInstance } from "class-transformer";
import { PaginationRequestDto } from "../dtos/pagination.dto";
import { StopService } from "../services/stop.service";
import { SaveStopRequestDto } from "../dtos/stop.dto";
import { IController } from "./interface/controller.interface";
import * as R from "../utils/response";

export class StopController implements IController {
  public path = "/stops";
  public router = Router();

  constructor(private readonly stopService: StopService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", validationMiddleware(SaveStopRequestDto), this.createStop);
    this.router.get("/", validationMiddleware(PaginationRequestDto, "query"), this.getStops);
    this.router.get("/:id", this.getStopById);
    this.router.put("/:id", validationMiddleware(SaveStopRequestDto), this.updateStop);
    this.router.delete("/:id", this.deleteStop);
  }

  /**
   * 建立招呼站
   */
  private createStop = async (req: Request, res: Response) => {
    const dto = plainToInstance(SaveStopRequestDto, req.body);

    const result = await this.stopService.createStop(dto);

    R.success(res, result);
  };

  /**
   * 取得招呼站列表
   */
  private getStops = async (req: Request, res: Response) => {
    const dto = plainToInstance(PaginationRequestDto, req.query);

    const result = await this.stopService.getStops(dto);

    R.success(res, result);
  };

  /**
   * 取得招呼站詳細資訊
   */
  private getStopById = async (req: Request<{ id: string }>, res: Response) => {
    const result = await this.stopService.getStopById(+req.params.id);

    R.success(res, result);
  };

  /**
   * 更新招呼站
   */
  private updateStop = async (req: Request<{ id: string }>, res: Response) => {
    const dto = plainToInstance(SaveStopRequestDto, req.body);

    await this.stopService.updateStop(+req.params.id, dto);

    R.success(res);
  };

  /**
   * 刪除招呼站
   */
  private deleteStop = async (req: Request<{ id: string }>, res: Response) => {
    await this.stopService.deleteStop(+req.params.id);

    R.success(res);
  };
}
