import { ParteDiario, RiesgoParteDiario, Trabajo } from "@prisma/client";
import {
  I_RiskDailyPart,
  I_RiskDailyPartForId,
  I_RiskDailyPartForPdf,
} from "../riskDailyPart/models/riskDailyPart.interface";
import { I_Trabajo } from "../../job/models/job.interface";

export interface I_CreateDailyPartBD
  extends Omit<
    ParteDiario,
    | "id"
    | "etapa"
    | "jornada"
    | "hora_inicio"
    | "hora_fin"
    | "descripcion_actividad"
    | "nota"
    | "distanciamiento"
    | "protocolo_ingreso"
    | "protocolo_salida"
    | "riesto_parte_diario_id"
    | "fecha_creacion"
    | "eliminado"
  > {}
export interface I_UpdateDailyPartBD
  extends Omit<
    ParteDiario,
    | "id"
    | "fecha"
    | "codigo"
    | "nombre"
    | "fecha_creacion"
    | "eliminado"
    | "riesto_parte_diario_id"
  > {}

export interface I_DailyPartCreateBody {
  fecha: string;
  job_id: number;
}
export interface I_DailyPartUpdateBody {
  fecha: string;
  etapa: string;
  jornada: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion_actividad: string;
  nota: string;
  distanciamiento: boolean;
  protocolo_ingreso: boolean;
  protocolo_salida: boolean;
}

export interface I_DailyPart extends ParteDiario {
  Trabajo: Trabajo;
}
export interface I_ParteDiario extends ParteDiario {
  Trabajo: I_Trabajo;
  RiesgoParteDiario: I_RiskDailyPartForId | null;
}

export interface I_DailyPartId
  extends Omit<
    ParteDiario,
    | "codigo"
    | "eliminado"
    | "trabajo_id"
    | "proyecto_id"
    | "fecha_creacion"
    | "riesto_parte_diario_id"
    | "RiesgoParteDiario"
  > {
  restriccion: I_RiskDailyPart | null;
  nombre_trabajo: string;
}

export interface I_DailyPartPdf {
  date: string;
}
