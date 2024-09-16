import { CategoriaRecurso } from "@prisma/client";

export interface I_CreateResourseCategoryBD
  extends Omit<CategoriaRecurso, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateResourseCategoryBody
  extends Omit<CategoriaRecurso, "id"> {}

export interface I_UpdateResourseCategoryBody
  extends Omit<CategoriaRecurso, "id"> {}

export interface I_ResourseCategory
  extends Omit<CategoriaRecurso, "eliminado"> {}
