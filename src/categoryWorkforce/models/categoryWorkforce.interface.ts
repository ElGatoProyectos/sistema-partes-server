import { Banco, CategoriaObrero } from "@prisma/client";

export interface I_CreateCategoryWorkforceBD
  extends Omit<CategoriaObrero, "id"> {}

export interface I_CreateCategoryWorkforceBody
  extends Omit<CategoriaObrero, "id"> {}

export interface I_CategoryWorkforce
  extends Omit<CategoriaObrero, "eliminado"> {}
