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
  > {}
export interface I_UpdateDailyPartBD
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
  > {}
