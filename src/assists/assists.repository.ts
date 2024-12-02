import { E_Asistencia_BD } from "@prisma/client";
import {
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import {
  T_FindAllAssists,
  T_FindAllAssistsForDailyPart,
  T_FindAllWeekAssists,
} from "./models/assists.types";

export abstract class BankWorkforceRepository {
  findAll(
    skip: number,
    data: T_FindAllAssists,
    project_id: number,
    responsible_id?: number
  ): void {}
  findAllPresents(
    skip: number,
    data: T_FindAllAssistsForDailyPart,
    project_id: number
  ): void {}

  findAllWithOutPagination(project_id: number): void {}

  findById(assists_id: number): void {}

  findByDate(date: Date,project_id:number): void {}

  findAllWithOutPaginationByDate(date: Date): void {}

  findAllWithOutPaginationByDateAndProject(date: Date,project_id:number): void {}

  findByDateAndWorkforce(date: Date, workforce_id: number,project_id:number): void {}

  findAllByWeek(
    skip: number,
    data: T_FindAllWeekAssists,
    project_id: number,
    week: string
  ): void {}

  findByIdMoAndDate(mano_obra_id: number,project_id:number): void {}

  createAssists(data: I_CreateAssistsWorkforceBD): void {}

  createManyAssists(data: I_CreateAssistsWorkforceBD[]): void {}

  updateAssistsPresent(assists_id: number, data: E_Asistencia_BD,project_id:number): void {}

  updateAssistsNotPresent(assists_id: number, data: E_Asistencia_BD,project_id:number): void {}

  updateAssists(
    data: I_UpdateAssitsBD,
    daily_part_id: number,
    workforce_id: number
  ): void {}

  updateStatusAssists(assists_id: number): void {}

  updateManyStatusAsigned(
    ids: number[],
    project_id: number,
    date: Date | null
  ): void {}

  updateManyStatusAsignedX2(
    ids: number[],
    project_id: number,
    date: Date | null
  ): void {}

  updateManyStatusNotAsigned(
    ids: number[],
    project_id: number,
    date: Date | null
  ): void {}

  findDatesByLegend(project_id: number): void {}
}
