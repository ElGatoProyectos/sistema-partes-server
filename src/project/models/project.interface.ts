import { Proyecto } from "@prisma/client";

export interface I_CreateProjectBD extends Omit<Proyecto, "id"> {}

export interface I_CreateUserBody
  extends Omit<Proyecto, "id" | "fecha_creacion" | "fecha_fin"> {
  fecha_creacion: string;
  fecha_fin: string;
}

export interface I_UpdateProyectBody extends Partial<I_CreateProjectBD> {}
