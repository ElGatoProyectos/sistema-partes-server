import { TipoObrero } from "@prisma/client";

export interface I_CreateTypeWorkforceBD extends Omit<TipoObrero, "id"> {}

export interface I_CreateTypeWorkforceBody extends Omit<TipoObrero, "id"> {}

export interface I_TypeWorkforce extends Omit<TipoObrero, "eliminado"> {}
