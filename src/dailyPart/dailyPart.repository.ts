import {
  I_CreateDailyPartBD,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";

export abstract class DailyPartRepository {
  findByIdJob(job_id: number): void {}

  createDailyPart(data: I_CreateDailyPartBD): void {}

  updateDailyPart(data: I_UpdateDailyPartBD, daily_part_id: number): void {}

  findById(daily_part_id: number): void {}

  codeMoreHigh(project_id: number, job_id: number): void {}
}
