import { Trabajo } from "@prisma/client";

export interface I_CreateJobBD extends Omit<Trabajo, "id"> {}

export interface I_CreateJobBody extends Omit<Trabajo, "id"> {}

export interface I_UpdateJobBody extends Omit<Trabajo, "id"> {}

export interface I_Job extends Omit<Trabajo, "eliminado"> {}

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
