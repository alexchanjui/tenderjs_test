// src/services/stop.service.ts

import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { IServiceContext } from "../types/service.context";
import { SaveStopRequestDto, StopResponseDto } from "../dtos/stop.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { plainToInstance } from "class-transformer";

export class StopService {
  constructor(private ctx: IServiceContext) {}

  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;
    if (!currentUser) throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    return currentUser;
  }

  /**
   * 建立招呼站
   */
  public async createStop(data: SaveStopRequestDto): Promise<StopResponseDto> {
    const currentUser = this.getCurrentUser();

    return await this.ctx.repos.stop.create({
      ...data,
      updateUserId: currentUser.id,
    });
  }

  /**
   *  取得招呼站列表
   */
  public async getStops(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<StopResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [stops, total] = await this.ctx.repos.stop.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(StopResponseDto, stops, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 取得招呼站詳細資訊
   */
  public async getStopById(id: number): Promise<StopResponseDto> {
    const stop = await this.ctx.repos.stop.findById(id);

    if (!stop) throw new AppError(ErrorCode.NOT_FOUND, "招呼站不存在");

    return plainToInstance(StopResponseDto, stop, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新招呼站
   */
  public async updateStop(id: number, data: SaveStopRequestDto): Promise<StopResponseDto> {
    const currentUser = this.getCurrentUser();

    const stop = await this.ctx.repos.stop.findById(id);

    if (!stop) throw new AppError(ErrorCode.NOT_FOUND, "招呼站不存在");

    const updatedStop = await this.ctx.repos.stop.update(id, {
      ...data,
      updateUserId: currentUser.id,
    });

    return plainToInstance(StopResponseDto, updatedStop, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 刪除招呼站
   */
  public async deleteStop(id: number): Promise<void> {
    const stop = await this.ctx.repos.stop.findById(id);

    if (!stop) throw new AppError(ErrorCode.NOT_FOUND, "招呼站不存在");

    await this.ctx.repos.stop.delete(id);
  }
}
