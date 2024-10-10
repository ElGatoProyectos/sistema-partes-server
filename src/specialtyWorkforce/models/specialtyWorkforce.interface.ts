import { EspecialidadObrero } from "@prisma/client";

export interface I_CreateSpecialtyWorkforceBD
  extends Omit<EspecialidadObrero, "id"> {}

export interface I_CreateSpecialtyWorkforceBody
  extends Omit<EspecialidadObrero, "id"> {}

export interface I_SpecialtyWorkforce
  extends Omit<EspecialidadObrero, "eliminado"> {}
