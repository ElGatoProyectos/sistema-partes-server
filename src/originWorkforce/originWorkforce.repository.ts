import {
  I_CreateOriginWorkforceBD,
  I_UpdateOriginBD,
} from "./models/originWorkforce.interface";
import { T_FindAllOrigin } from "./models/originWorkforce.types";

export abstract class OriginWorkforceRepository {
  findAll(skip: number, data: T_FindAllOrigin, project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createOriginWorkforce(data: I_CreateOriginWorkforceBD): void {}

  updateOriginWorkforce(origin_id: number, data: I_UpdateOriginBD): void {}

  updateStatusOriginWorkforce(origin_id: number): void {}

  createOriginWorkforceMasive(data: I_CreateOriginWorkforceBD[]): void {}
}
