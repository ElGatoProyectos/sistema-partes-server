import { Seccion } from "@prisma/client";

export interface I_CreateSeccionBD extends Omit<Seccion, "id"> {}
