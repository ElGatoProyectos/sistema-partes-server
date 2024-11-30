import {
  DetalleTrabajoPartida,
  Partida,
  Trabajo,
  Unidad,
} from "@prisma/client";
import { I_TrabajoForPdf } from "../../../job/models/job.interface";

export interface I_DepartureJobExcel {
  "ID-TRABAJO": string;
  PARTIDA: string;
  UNIDAD: string;
  METRADO: number;
}

export interface I_DepartureJob
  extends Omit<DetalleTrabajoPartida, "eliminado"> {}

export interface I_DetailDepartureJob {
  id: number;
  trabajo_id: number;
  partida_id: number;
  Trabajo: I_Job;
  Partida: I_Departure;
  cantidad_total: number;
}

export interface I_Departure extends Partida {}
export interface I_Job extends Trabajo {}

export interface I_DepartureJob {
  job_id: number;
  departure_id: number;
  metrado: number;
}
export interface I_DepartureJobUpdate {
  departure_id: number;
  metrado: number;
}
export interface I_DepartureJobBBDD {
  id: number;
  trabajo_id: number;
  partida_id: number;
  cantidad_total: number;
  Partida: Partida;
  Trabajo: Trabajo;
}

export interface createDetailWorkDeparture {
  trabajo_id: number;
  partida_id: number;
  cantidad_total: number;
}
export interface existsDetailWorkDeparture {
  id: number;
  trabajo_id: number;
  partida_id: number;
  cantidad_total: number;
}

export interface I_DepartureJobForPdf {
  id: number;
  trabajo_id: number;
  partida_id: number;
  cantidad_total: number;
  Partida: Partida;
  Trabajo: I_TrabajoForPdf;
}

export interface I_DepartureForPdf extends Partida {
  Unidad: Unidad | null;
}
