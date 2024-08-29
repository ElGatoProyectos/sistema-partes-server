import { Proyecto } from "@prisma/client";

export interface I_CreateProyectoBD extends Omit<Proyecto, "id"> {}
