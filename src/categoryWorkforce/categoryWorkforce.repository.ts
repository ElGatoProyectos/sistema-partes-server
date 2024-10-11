import { I_CreateCategoryWorkforceBD } from "./models/categoryWorkforce.interface";

export abstract class BankCategoryforceRepository {
  findAll(): void {}

  findById(bank_id: number): void {}

  createCategoryWorkforce(data: I_CreateCategoryWorkforceBD): void {}

  createCategoryWorkforceMasive(data: I_CreateCategoryWorkforceBD[]): void {}

  findByName(name: String, project_id: number): void {}
}
