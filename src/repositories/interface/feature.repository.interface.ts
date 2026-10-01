// src/repositories/interface/feature.repository.interface.ts
import type { Feature } from "@prisma/client";
import type { CreateFeatureRequestDto, UpdateFeatureRequestDto } from "../../dtos/feature.dto";

export interface IFeatureRepository {
  create(data: CreateFeatureRequestDto): Promise<Feature>;
  findAll(): Promise<Feature[]>;
  findByCode(featureCode: number): Promise<Feature | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[Feature[], number]>;
  update(featureCode: number, data: UpdateFeatureRequestDto): Promise<void>;
  batchDelete(featureCodes: number[]): Promise<void>;
}
