import { CategoriaRecurso, IndiceUnificado, Recurso, Unidad } from "@prisma/client";

export interface I_CreateResourcesBD
  extends Omit<Recurso, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateResourcesBody extends Omit<Recurso, "id"> {}

export interface I_UpdateResourcesBody extends Omit<Recurso, "id"> {}

export interface I_UpdateResourcesBodyValidation
  extends Omit<Recurso, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_Resources extends Omit<Recurso, "eliminado"> {}

export interface I_ResourcesExcel {
  "NOMBRE INDICE UNIFICADO": string;
  CODIGO: string;
  "NOMBRE DEL RECURSO": string;
  UNIDAD: string;
  "NOMBRE CATEGORIA RECURSO": string;
  PRECIO: string;
}

export interface I_Recurso extends Recurso {
  Unidad: Unidad;
  IndiceUnificado: IndiceUnificado;
}
export interface I_RecursoForPdf extends Recurso {
  Unidad: Unidad;
  IndiceUnificado: IndiceUnificado;
  CategoriaRecurso: CategoriaRecurso
}
