import {
  I_CreateDailyPartBD,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";
import { T_FindAllDailyPart } from "./models/dailyPart.types";

export abstract class DailyPartRepository {
  findByIdJob(job_id: number): void {}

  createDailyPart(data: I_CreateDailyPartBD): void {}

  updateDailyPart(data: I_UpdateDailyPartBD, daily_part_id: number): void {}

  updateDailyParForRisk(
    daily_part_id: number,
    risk_daily_part_id: number
  ): void {}

  findById(daily_part_id: number): void {}

  codeMoreHigh(project_id: number, job_id: number): void {}

  findAllForJob(skip: number, data: T_FindAllDailyPart, job_id: number): void {}
}
