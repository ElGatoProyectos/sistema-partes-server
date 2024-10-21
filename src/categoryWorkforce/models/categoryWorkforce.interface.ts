import { CategoriaObrero } from "@prisma/client";

export interface I_CreateCategoryWorkforceBD
  extends Omit<CategoriaObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateCategoryWorkforceBody
  extends Omit<CategoriaObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CategoryWorkforce
  extends Omit<CategoriaObrero, "eliminado"> {}

export interface I_CategoryWorkforce
  extends Omit<CategoriaObrero, "eliminado"> {}

export interface I_UpdateCategoryWorkforceBD
  extends Omit<CategoriaObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CategoryWorkforceBody {
  nombre: string;
}
