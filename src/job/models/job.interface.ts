import { Trabajo } from "@prisma/client";

export interface I_CreateJobBD
  extends Omit<
    Trabajo,
    "id" | "eliminado" | "fecha_creacion" | "estado_trabajo"
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

export interface I_UpdateJobBody extends Omit<Trabajo, "id"> {}

export interface I_Job extends Omit<Trabajo, "eliminado"> {}

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

// export interface I_UpdateTrainBodyValidation
//   extends Omit<
//     Tren,
//     "id" | "eliminado" | "fecha_creacion" | "peon" | "oficial" | "operario"
//   > {}

// export interface I_Cuadrilla_Train {
//   workers: number;
//   official: number;
//   pawns: number;
// }
// export interface I_TrainExcel {
//   //coloco asi el primero ya q sino me da error sin el -
//   "ID-TREN": string;
//   TREN: string;
//   NOTA: string;
// }
// export interface I_ImportExcelRequestTrain {
//   idProject: string;
// }