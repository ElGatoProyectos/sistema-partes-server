import { Rol } from "@prisma/client";

export interface I_CreateRolBD extends Omit<Rol, "id"> {}

export interface I_CreateRolBody extends Omit<Rol, "id"> {}

export interface I_Rol extends Omit<Rol, "eliminado"> {}
