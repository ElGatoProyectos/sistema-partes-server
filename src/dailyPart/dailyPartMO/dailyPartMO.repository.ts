import { I_UpdateDailyPartMOBD } from "./models/dailyPartMO.interface";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.types";

export abstract class DailyPartMORepository {
  createDailyPartMO(ids: number[], project_id: number, job_id: number): void {}

  updateDailyPartMO(
    data: I_UpdateDailyPartMOBD,
    daily_part_mo_id: number
  ): void {}

  findAllWithOutPagination(project_id: number, daily_part_id: number): void {}

  findAll(
    skip: number,
    data: T_FindAllDailyPartMO,
    project_id: number,
    daily_part_id: number
  ): void {}

  findById(daily_part_mo_id: number): void {}

  delete(daily_part_mo_id: number): void {}

  findAllWithOutPaginationForIdMO(workforce_id: number, date: Date): void {}
  findAllWithOutPaginationForIdsDailysParts(idsDailyParts: number[]): void {}
}
