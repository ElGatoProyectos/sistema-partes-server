import { ParteDiario } from "@prisma/client";

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
export interface I_UpdateDailyPartBD extends Omit<ParteDiario, "id"> {}

export interface I_DailyPartCreateBody {
  fecha: string;
  job_id: number;
}
