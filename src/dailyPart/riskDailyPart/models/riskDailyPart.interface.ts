import {
  E_Estado_Riesgo_BD,
  E_Riesgo_BD,
  RiesgoParteDiario,
} from "@prisma/client";

export interface I_CreateRiskDailyPartBD
  extends Omit<RiesgoParteDiario, "id" | "fecha_creacion" | "eliminado"> {}
export interface I_UpdateRiskDailyPartBD
  extends Omit<RiesgoParteDiario, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_RiskDailyPartBody {
  descripcion: string;
  estado: string;
  riesgo: string;
}

export interface I_RiskDailyPart {
  descripcion: string | null;
  estado: E_Estado_Riesgo_BD | null;
  riesgo: E_Riesgo_BD | null;
}
export interface I_RiskDailyPartForId {
  id: number;
  descripcion: string | null;
  estado: E_Estado_Riesgo_BD | null;
  riesgo: E_Riesgo_BD | null;
}
