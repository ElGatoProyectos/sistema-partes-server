import { I_CreateUnitBD, I_UpdateUnitBody } from "./models/unit.interface";
import { T_FindAllUnit } from "./models/unit.types";

export abstract class UnitRepository {
  findAll(skip: number, data: T_FindAllUnit, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUnit: number): void {}

  codeMoreHigh(project_id: number): void {}

  existsName(name: string, project_id: number): void {}

  existsSymbol(symbol: string, project_id: number): void {}

  createUnit(data: I_CreateUnitBD): void {}

  updateUnit(data: I_UpdateUnitBody, idUnit: number): void {}

  updateStatusUnit(idResourseCategory: number): void {}
}
