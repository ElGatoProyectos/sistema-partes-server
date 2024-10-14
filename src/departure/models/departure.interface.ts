import { Partida } from "@prisma/client";

export interface I_CreateDepartureBD
  extends Omit<
    Partida,
    "id" | "eliminado" | "fecha_creacion" | "estado_trabajo"
  > {}
export interface I_UpdateDepartureBD
  extends Omit<Partida, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_UpdateDepartureBDValidationExcel
  extends Omit<Partida, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_CreateDepartureBody
  extends Omit<
    Partida,
    | "id"
    | "partida"
    | "metrado_inicial"
    | "fecha_inicio"
    | "fecha_finalizacion"
    | "eliminado"
    | "fecha_creacion"
    | "mano_de_obra_unitaria"
  > {
  metrado: number;
  nombre_partida: string;
  mano_obra_unitaria: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
}

export interface I_UpdateDepartureBody
  extends Omit<
    Partida,
    | "id"
    | "partida"
    | "metrado_inicial"
    | "fecha_inicio"
    | "fecha_finalizacion"
    | "eliminado"
    | "fecha_creacion"
    | "mano_de_obra_unitaria"
  > {
  metrado: number;
  nombre_partida: string;
  mano_obra_unitaria: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
}

export interface I_Departure extends Omit<Partida, "eliminado"> {}

export interface I_DepartureExcel {
  "ID-PARTIDA": string;
  ITEM: string;
  PARTIDA: string;
  UNI: string;
  METRADO: string;
  PRECIO: string;
  "MANO DE OBRA UNITARIO": string;
  "MATERIAL UNITARIO": string;
  "EQUIPO UNITARIO": string;
  "SUBCONTRATA - VARIOS UNITARIO": string;
}
