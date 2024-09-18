import { I_CreateUnitBD, I_UpdateUnitBody } from "./models/unit.interface";

export abstract class UnitRepository {
  findAll(skip: number, limit: number): void {}

  findById(idUnit: number): void {}

  codeMoreHigh(): void {}

  existsName(name: string): void {}

  existsSymbol(symbol: string): void {}

  createUnit(data: I_CreateUnitBD): void {}

  updateUnit(data: I_UpdateUnitBody, idUnit: number): void {}

  updateStatusUnit(idResourseCategory: number): void {}

  searchNameUnit(name: string, skip: number, limit: number): void {}
}
