import { DetalleTrabajoPartida, Partida, Trabajo } from "@prisma/client";

export interface I_DepartureJobExcel {
  "ID-TRABAJO": string;
  PARTIDA: string;
  UNIDAD: string;
  METRADO: number;
  COSTO: string;
  MATERIAL: number;
  "MANO DE OBRA": string;
  EQUIPOS: string;
  VARIOS: string;
}

export interface I_DepartureJob
  extends Omit<DetalleTrabajoPartida, "eliminado"> {}

export interface I_DetailDepartureJob {
  id: 1;
  Trabajo: I_Job;
  Partida: I_Departure;
  metrado_utilizado: 1;
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
  metrado_utilizado: number;
  Partida: Partida;
  Trabajo: Trabajo;
}
