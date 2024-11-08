import { E_Estado_BD, ParteDiario, Trabajo } from "@prisma/client";

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
  distanciamiento: string;
  protocolo_ingreso: string;
  protocolo_salida: string;
}

export interface I_DailyPart extends ParteDiario {
  Trabajo: Trabajo;
}
