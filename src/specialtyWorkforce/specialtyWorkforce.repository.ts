import { I_CreateSpecialtyWorkforceBD } from "./models/specialtyWorkforce.interface";

export abstract class SpecialtyWorkforceRepository {
  findAll(project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createSpecialtyWorkforce(data: I_CreateSpecialtyWorkforceBD): void {}

  createSpecialtyWorkforceMasive(data: I_CreateSpecialtyWorkforceBD[]): void {}
}
