import { I_CreateDailyPartBD } from "./models/dailyPart.interface";

export abstract class DailyPartRepository {
  findByIdJob(job_id: number): void {}

  createDailyPart(data: I_CreateDailyPartBD): void {}

  findById(daily_part: number): void {}
}
