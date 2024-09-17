import { Tren } from "@prisma/client";

export interface I_CreateTrainBD extends Omit<Tren, "id"> {}

export interface I_CreateTrainUnitBody extends Omit<Tren, "id"> {}

export interface I_UpdateTrainBody extends Omit<Tren, "id"> {}

export interface I_Train extends Omit<Tren, "eliminado"> {}

export interface I_Cuadrilla_Train {
  idTrain: number;
  workers: number;
  official: number;
  pawns: number;
}
export interface I_ProductionUnitExcel {
  Nombre: string;
  Cuadrilla: string;
}
export interface I_ImportExcelRequest {
  idProject: string;
}
