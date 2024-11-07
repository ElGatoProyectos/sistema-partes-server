import { I_CreateResourcesBD } from "../resources/models/resources.interface";
import {
  I_CreateResourseCategoryBD,
  I_UpdateResourseCategoryBody,
} from "./models/resourseCategory.interface";

export abstract class ResourseCategoryRepository {
  findAll(skip: number, limit: number, project_id: number): void {}

  findById(idResourseCategory: number): void {}

  existsName(name: string, project_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createResourseCategory(data: I_CreateResourseCategoryBD): void {}

  updateResourseCategory(
    data: I_UpdateResourseCategoryBody,
    idResourseCategory: number
  ): void {}

  updateStatusResourseCategory(idResourseCategory: number): void {}

  searchNameResourseCategory(name: string, skip: number, limit: number): void {}

  createResourcesCategoryMasive(data: I_CreateResourcesBD[]): void {}

  codeMoreHigh(project_id: number): void {}
}
