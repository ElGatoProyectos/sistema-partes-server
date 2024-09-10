import {
  I_CreateProductionUnitBD,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";

export abstract class ProudctionUnitRepository {
  findAll(skip: number, limit: number): void {}

  findById(idUser: number): void {}

  createProductionUnit(data: I_CreateProductionUnitBD): void {}

  updateProductionUnit(
    data: I_UpdateProductionUnitBody,
    idUser: number
  ): void {}

  updateStatusProductionUnit(idUser: number): void {}

  searchNameProductionUnit(name: string, skip: number, limit: number): void {}
}
