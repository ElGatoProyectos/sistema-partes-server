import {
  I_CreateDailyPartBD,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";
import {
  T_FindAllDailyPart,
  T_FindAllDailyPartForJob,
} from "./models/dailyPart.types";

export abstract class DailyPartRepository {
  findByIdJob(job_id: number): void {}

  createDailyPart(data: I_CreateDailyPartBD): void {}

  createDailyPartMO(): void {}

  updateDailyPart(data: I_UpdateDailyPartBD, daily_part_id: number): void {}

  updateDailyParForRisk(
    daily_part_id: number,
    risk_daily_part_id: number | null
  ): void {}

  findById(daily_part_id: number): void {}

  findByIdRisk(risk_part_id: number): void {}

  codeMoreHigh(project_id: number, job_id: number): void {}

  findAllForJob(
    skip: number,
    data: T_FindAllDailyPartForJob,
    job_id: number
  ): void {}

  findAllForProject(
    skip: number,
    data: T_FindAllDailyPart,
    project_id: number
  ): void {}
}
