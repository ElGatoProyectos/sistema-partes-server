import {
  I_CreateResourseCategoryBD,
  I_UpdateResourseCategoryBody,
} from "./models/resourseCategory.interface";

export abstract class ResourseCategoryRepository {
  findAll(skip: number, limit: number): void {}

  findById(idResourseCategory: number): void {}

  existsName(name: string): void {}

  createResourseCategory(data: I_CreateResourseCategoryBD): void {}

  updateResourseCategory(
    data: I_UpdateResourseCategoryBody,
    idResourseCategory: number
  ): void {}

  updateStatusResourseCategory(idResourseCategory: number): void {}

  searchNameResourseCategory(name: string, skip: number, limit: number): void {}
}
