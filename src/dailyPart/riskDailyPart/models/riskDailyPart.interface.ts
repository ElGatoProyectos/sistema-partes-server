import { RiesgoParteDiario } from "@prisma/client";

export interface I_CreateRiskDailyPartBD
  extends Omit<RiesgoParteDiario, "id" | "fecha_creacion" | "eliminado"> {}
export interface I_UpdateRiskDailyPartBD
  extends Omit<RiesgoParteDiario, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_RiskDailyPartBody {
  descripcion: string;
  estado: string;
  riesgo: string;
}
