import { Empresa } from "@prisma/client";
import { I_Usuario } from "src/user/models/user.interface";

export interface I_CreateCompanyBD
  extends Omit<Empresa, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_UpdateCompanyBD extends Omit<Empresa, "id"> {}

export interface I_CreateCompanyBody extends Omit<Empresa, "id"> {}

export interface I_CreateCompanyAdminBody
  extends Omit<Empresa, "id" | "usuario_id"> {}

export interface I_UpdateCompanyBody
  extends Omit<Empresa, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_Company extends Omit<Empresa, "eliminado"> {}

//esto sirve para el findAll de user
export interface I_Empresa extends Empresa {
  Usuario: I_Usuario; // Relación con el usuario
}
