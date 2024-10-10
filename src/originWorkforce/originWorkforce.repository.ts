import { I_CreateOriginWorkforceBD } from "./models/originWorkforce.interface";

export abstract class OriginWorkforceRepository {
  findAll(project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createOriginWorkforce(data: I_CreateOriginWorkforceBD): void {}

  createOriginWorkforceMasive(data: I_CreateOriginWorkforceBD[]): void {}
}
