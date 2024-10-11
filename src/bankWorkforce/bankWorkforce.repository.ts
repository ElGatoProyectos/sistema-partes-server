import { I_CreateBankWorkforceBD } from "./models/bankWorkforce.interface";

export abstract class BankWorkforceRepository {
  findAll(): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createBankWorkforce(data: I_CreateBankWorkforceBD): void {}

  createBankWorkforceMasive(data: I_CreateBankWorkforceBD[]): void {}

  existsName(name: String): void {}
}
