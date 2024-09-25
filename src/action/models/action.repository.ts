import { Accion } from "@prisma/client";

export interface I_CreateAccionBD extends Omit<Accion, "id"> {}
