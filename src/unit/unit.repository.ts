import { I_CreateUnitBD, I_UpdateUnitBody } from "./models/unit.interface";

export abstract class UnitRepository {
  findAll(skip: number, limit: number, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUnit: number): void {}

  codeMoreHigh(project_id: number): void {}

  existsName(name: string, project_id: number): void {}

  existsSymbol(symbol: string, project_id: number): void {}

  createUnit(data: I_CreateUnitBD): void {}

  updateUnit(data: I_UpdateUnitBody, idUnit: number): void {}

  updateStatusUnit(idResourseCategory: number): void {}
}
