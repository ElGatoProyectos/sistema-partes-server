import { Unidad } from "@prisma/client";

export interface I_CreateUnitBD
  extends Omit<Unidad, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateUnitBody extends Omit<Unidad, "id"> {}

export interface I_UpdateUnitBody extends Omit<Unidad, "id"> {}

export interface I_Unit extends Omit<Unidad, "eliminado"> {}
