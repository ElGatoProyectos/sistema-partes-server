import { OrigenObrero } from "@prisma/client";

export interface I_CreateOriginWorkforceBD
  extends Omit<OrigenObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateOriginWorkforceBody
  extends Omit<OrigenObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_OriginWorkforce extends Omit<OrigenObrero, "eliminado"> {}

export interface I_UpdateOriginBD
  extends Omit<OrigenObrero, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_OriginBody {
  nombre: string;
}

export interface I_Origin extends Omit<OrigenObrero, "eliminado"> {}
