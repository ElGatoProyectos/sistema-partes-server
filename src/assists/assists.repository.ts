import {
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import { T_FindAllAssists } from "./models/assists.types";

export abstract class BankWorkforceRepository {
  findAll(skip: number, data: T_FindAllAssists, project_id: number): void {}

  findById(assists_id: number): void {}

  createAssists(data: I_CreateAssistsWorkforceBD): void {}

  updateAssists(bank_id: number, data: I_UpdateAssitsBD): void {}

  updateStatusAssists(bank_id: number): void {}
}
