import { I_CreateTypeWorkforceBD } from "./models/typeWorkforce.interface";

export abstract class TypeWorkforceRepository {
  findAll(project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createTypeWorkforce(data: I_CreateTypeWorkforceBD): void {}

  createTypeWorkforceMasive(data: I_CreateTypeWorkforceBD[]): void {}
}
