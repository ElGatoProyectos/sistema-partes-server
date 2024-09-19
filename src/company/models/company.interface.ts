import { Empresa } from "@prisma/client";

export interface I_CreateCompanyBD
  extends Omit<Empresa, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_UpdateCompanyBD extends Omit<Empresa, "id"> {}

export interface I_CreateCompanyBody extends Omit<Empresa, "id"> {}

export interface I_CreateCompanyAdminBody
  extends Omit<Empresa, "id" | "usuario_id"> {}

export interface I_UpdateCompanyBody
  extends Omit<Empresa, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_Company extends Omit<Empresa, "eliminado"> {}
