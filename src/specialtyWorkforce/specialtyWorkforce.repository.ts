import { T_FindAllSpecialty } from "./models/specialtyWorkforce.types";
import {
  I_CreateSpecialtyWorkforceBD,
  I_UpdateSpecialtyBD,
} from "./models/specialtyWorkforce.interface";

export abstract class SpecialtyWorkforceRepository {
  findAll(skip: number, data: T_FindAllSpecialty, project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createSpecialtyWorkforce(data: I_CreateSpecialtyWorkforceBD): void {}

  updateSpecialtyWorkforce(
    speciality_id: number,
    data: I_UpdateSpecialtyBD
  ): void {}

  updateStatusSpecialtyWorkforce(speciality_id: number): void {}

  createSpecialtyWorkforceMasive(data: I_CreateSpecialtyWorkforceBD[]): void {}
}
