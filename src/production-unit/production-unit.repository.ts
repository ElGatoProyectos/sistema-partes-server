import {
  I_CreateProductionUnitBD,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";
import { T_FindAllUp } from "./models/up.types";

export abstract class ProudctionUnitRepository {
  findAllPagination(
    skip: number,
    data: T_FindAllUp,
    project_id: number
  ): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createProductionUnit(data: I_CreateProductionUnitBD): void {}

  updateProductionUnit(
    data: I_UpdateProductionUnitBody,
    idUser: number
  ): void {}

  existsName(name: string): void {}

  updateStatusProductionUnit(idUser: number): void {}

  searchNameProductionUnit(name: string, skip: number, limit: number): void {}

  codeMoreHigh(project_id: number): void {}
}
