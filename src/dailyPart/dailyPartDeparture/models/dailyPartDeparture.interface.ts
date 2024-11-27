import { ParteDiarioPartida } from "@prisma/client";
import { I_DailyPart } from "../../models/dailyPart.interface";
import {
  I_DepartureForPdf,
  I_DepartureJobForPdf,
} from "../../../departure/departure-job/models/departureJob.interface";

export interface UpdateDailyPartDeparture
  extends Omit<ParteDiarioPartida, "id"> {}

export interface I_DailyPartDepartureBody {
  quantity_used: number;
}

export interface I_DailyPartDeparture {
  id: number;
  parte_diario_id: number;
  partida_id: number;
  cantidad_utilizada: number;
  ParteDiario: I_DailyPart;
  Partida: I_DepartureForPdf;
}
export interface I_DailyPartDepartureForPdf {
  id: number;
  cantidad_utilizada: number;
  Partida: I_DepartureForPdf;
}

export interface I_DailyPartDepartureForId {
  item: string | string ;
  partida: string | string; 
  unidad: string | string;
  cantidad_programada: number | string;
  cantidad_utilizada: number | string;
}
