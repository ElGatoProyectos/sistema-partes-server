import { TipoObrero } from "@prisma/client";

export interface I_CreateTypeWorkforceBD
  extends Omit<TipoObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_UpdateTypeBD
  extends Omit<TipoObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateTypeWorkforceBody
  extends Omit<TipoObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_TypeWorkforce extends Omit<TipoObrero, "eliminado"> {}

export interface I_TypeBody {
  nombre: string;
}

export interface I_Type extends Omit<TipoObrero, "eliminado"> {}
