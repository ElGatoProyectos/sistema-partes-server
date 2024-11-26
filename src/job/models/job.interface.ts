import {
  CategoriaObrero,
  ManoObra,
  Trabajo,
  Tren,
  Unidad,
  UnidadProduccion,
} from "@prisma/client";

export interface I_CreateJobBD
  extends Omit<
    Trabajo,
    "id" | "eliminado" | "fecha_creacion" | "estado_trabajo"
  > {}
export interface I_UpdateJobBD
  extends Omit<Trabajo, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_UpdateJobBDValidationExcel
  extends Omit<
    Trabajo,
    "id" | "nota" | "estado_trabajo" | "eliminado" | "fecha_creacion"
  > {}

export interface I_CreateJobBody
  extends Omit<
    Trabajo,
    | "id"
    | "fecha_inicio"
    | "fecha_finalizacion"
    | "eliminado"
    | "fecha_creacion"
  > {
  fecha_inicio: string;
  fecha_finalizacion: string;
}

export interface I_UpdateJobBody
  extends Omit<
    Trabajo,
    | "id"
    | "fecha_inicio"
    | "fecha_finalizacion"
    | "eliminado"
    | "fecha_creacion"
  > {
  fecha_inicio: string;
  fecha_finalizacion: string;
}

export interface I_Job extends Omit<Trabajo, "eliminado"> {}

export interface I_JobExcel {
  "ID-TRABAJO": string;
  TRABAJOS: string;
  TREN: string;
  "UNIDAD DE PRODUCCION": string;
  INICIO: number;
  DURA: string;
  FINALIZA: number;
  COSTO: string;
  MAT: string;
  MO: string;
  EQ: string;
  HE: string;
}

export interface I_Trabajo {
  codigo: string;
  nombre: string;
  costo_partida: number;
  costo_mano_obra: number;
  costo_material: number;
  costo_equipo: number;
  costo_varios: number;
  UnidadProduccion: UnidadProduccion;
}
export interface I_TrabajoPdf {
  codigo: string;
  nombre: string;
  costo_partida: number;
  costo_mano_obra: number;
  costo_material: number;
  costo_equipo: number;
  costo_varios: number;
  UnidadProduccion: UnidadProduccion;
  Tren:Tren
}
export interface I_TrabajoForPdf {
  codigo: string;
  nombre: string;
  costo_partida: number;
  UnidadProduccion: UnidadProduccion;
}
export interface I_JobAndCategoryWorkforce extends ManoObra {
  CategoriaObrero: CategoriaObrero | null;
}
export interface I_JobAndCategoryWorkforceForPdf extends ManoObra {
  CategoriaObrero: CategoriaObrero | null;
  Unidad: Unidad | null
}

// export interface I_CreateJobBody2
//   extends Omit<
//     Trabajo,
//     | "id"
//     | "codigo"
//     | "nombre"
//     | "duracion"
//     | "fecha_inicio"
//     | "fecha_finalizacion"
//     | "costo_partida"
//     | "costo_mano_obra"
//     | "costo_material"
//     | "costo_equipo"
//     | "costo_varios"
//     | "tren_id"
//     | "up_id"
//     | "proyecto_id"
//     | "usuario_id"
//     | "fecha_inicio"
//     | "fecha_finalizacion"
//     | "eliminado"
//     | "fecha_creacion"
//     | "estado_trabajo"
//   > {
//   codigo: string;
//   nombre: string;
//   duracion: number;
//   fecha_inicio: Date;
//   fecha_finalizacion: Date;
//   nota: string;
//   costo_partida: number;
//   costo_mano_obra: number;
//   costo_material: number;
//   costo_equipo: number;
//   costo_varios: number;
//   tren_id: number;
//   up_id: number;
//   proyecto_id: number;
//   usuario_id: number;
// }
