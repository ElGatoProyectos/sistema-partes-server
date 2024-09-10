import { Proyecto } from "@prisma/client";

export interface I_CreateProjectBD extends Omit<Proyecto, "id"> {}

export interface I_UpdateProjectBD
  extends Omit<Proyecto, "id" | "costo_proyecto"> {
  costo_proyecto: string;
}
export interface I_Project extends Omit<Proyecto, "eliminado"> {}

export interface I_CreateCompanyBody
  extends Omit<
    Proyecto,
    | "id"
    | "costo_proyecto"
    | "plazo_proyecto"
    | "codigo_proyecto"
    | "fecha_creacion"
    | "fecha_fin"
  > {
  plazo_proyecto: string;
  costo_proyecto: string;
  codigo_proyecto: string;
  fecha_creacion: string;
  fecha_fin: string;
}

export interface I_UpdateProyectBody
  extends Omit<Proyecto, "id" | "costo_proyecto"> {
  costo_proyecto: string;
}
