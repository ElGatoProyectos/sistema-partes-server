import {
  I_CreateCategoryWorkforceBD,
  I_UpdateCategoryWorkforceBD,
} from "./models/categoryWorkforce.interface";
import { T_FindAllCategoryWorkforce } from "./models/categoryWorkforce.types";

export abstract class CategoryWorkforceRepository {
  findAll(
    skip: number,
    data: T_FindAllCategoryWorkforce,
    project_id: number
  ): void {}

  findById(category_id: number): void {}

  createCategoryWorkforce(data: I_CreateCategoryWorkforceBD): void {}

  createCategoryWorkforceMasive(data: I_CreateCategoryWorkforceBD[]): void {}

  updateCategoryWorkforce(
    category_id: number,
    data: I_UpdateCategoryWorkforceBD
  ): void {}

  updateStatusCategoryWorkforce(category_id: number): void {}

  findByName(name: String, project_id: number): void {}
}
