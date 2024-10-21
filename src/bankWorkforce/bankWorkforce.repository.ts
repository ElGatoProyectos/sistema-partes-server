import {
  I_CreateBankWorkforceBD,
  I_UpdateBankBD,
} from "./models/bankWorkforce.interface";
import { T_FindAllBank } from "./models/bankWorkforce.types";

export abstract class BankWorkforceRepository {
  findAll(skip: number, data: T_FindAllBank, project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createBankWorkforce(data: I_CreateBankWorkforceBD): void {}

  createBankWorkforceMasive(data: I_CreateBankWorkforceBD[]): void {}

  updateBankWorkforce(bank_id: number, data: I_UpdateBankBD): void {}

  updateStatusBankWorkforce(bank_id: number): void {}

  existsName(name: String): void {}
}
