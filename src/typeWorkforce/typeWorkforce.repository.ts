import {
  I_CreateTypeWorkforceBD,
  I_UpdateTypeBD,
} from "./models/typeWorkforce.interface";
import { T_FindAllType } from "./models/typeWorkforce.types";

export abstract class TypeWorkforceRepository {
  findAll(skip: number, data: T_FindAllType, project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createTypeWorkforce(data: I_CreateTypeWorkforceBD): void {}

  updateTypeWorkforce(type_id: number, data: I_UpdateTypeBD): void {}

  updateStatusTypeWorkforce(type_id: number): void {}

  createTypeWorkforceMasive(data: I_CreateTypeWorkforceBD[]): void {}
}
