import { OrigenObrero } from "@prisma/client";

export interface I_CreateOriginWorkforceBD extends Omit<OrigenObrero, "id"> {}

export interface I_CreateOriginWorkforceBody extends Omit<OrigenObrero, "id"> {}

export interface I_OriginWorkforce extends Omit<OrigenObrero, "eliminado"> {}
