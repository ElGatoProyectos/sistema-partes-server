import { T_FindAllDailyPartMO } from "./models/dailyPartMO.dto";

export abstract class DailyPartMORepository {
  createDailyPartMO(ids: number[], project_id: number, job_id: number): void {}

  findAllWithOutPagination(project_id: number, daily_part_id: number): void {}

  findAll(skip: number, data: T_FindAllDailyPartMO, project_id: number): void {}
}
