import { EspecialidadObrero } from "@prisma/client";

export interface I_CreateSpecialtyWorkforceBD
  extends Omit<EspecialidadObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateSpecialtyWorkforceBody
  extends Omit<EspecialidadObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_SpecialtyWorkforce
  extends Omit<EspecialidadObrero, "eliminado"> {}

export interface I_SpecialtyWorkforce
  extends Omit<EspecialidadObrero, "eliminado"> {}

export interface I_UpdateSpecialtyBD
  extends Omit<EspecialidadObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_SpecialtyBody {
  nombre: string;
}
