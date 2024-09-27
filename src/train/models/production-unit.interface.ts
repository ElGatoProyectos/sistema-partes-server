import { Tren } from "@prisma/client";

export interface I_CreateTrainBD extends Omit<Tren, "id"> {}

export interface I_CreateTrainUnitBody extends Omit<Tren, "id"> {}

export interface I_UpdateTrainBody extends Omit<Tren, "id"> {}

export interface I_UpdateTrainBodyValidation
  extends Omit<
    Tren,
    "id" | "eliminado" | "fecha_creacion" | "peon" | "oficial" | "operario"
  > {}

export interface I_Train extends Omit<Tren, "eliminado"> {}

export interface I_Cuadrilla_Train {
  workers: number;
  official: number;
  pawns: number;
}
export interface I_TrainExcel {
  //coloco asi el primero ya q sino me da error sin el -
  "ID-TREN": string;
  TREN: string;
  NOTA: string;
}
export interface I_ImportExcelRequestTrain {
  idProject: string;
}
