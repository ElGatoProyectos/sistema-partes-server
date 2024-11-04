import { E_Asistencia_BD } from "@prisma/client";
import {
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import { T_FindAllAssists, T_FindAllWeekAssists } from "./models/assists.types";

export abstract class BankWorkforceRepository {
  findAll(
    skip: number,
    data: T_FindAllAssists,
    project_id: number,
    responsible_id?: number
  ): void {}

  findById(assists_id: number): void {}

  findByDate(date: Date): void {}

  findAllByWeek(
    skip: number,
    data: T_FindAllWeekAssists,
    project_id: number,
    week: string
  ): void {}

  findByIdMoAndDate(mano_obra_id: number): void {}

  createAssists(data: I_CreateAssistsWorkforceBD): void {}

  updateAssistsPresent(assists_id: number, data: E_Asistencia_BD): void {}

  updateAssistsNotPresent(assists_id: number, data: E_Asistencia_BD): void {}

  updateStatusAssists(assists_id: number): void {}
}
