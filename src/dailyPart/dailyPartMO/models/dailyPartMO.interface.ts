import { ParteDiarioMO } from "@prisma/client";

export interface I_UpdateDailyPartMOBD
  extends Omit<
    ParteDiarioMO,
    "id" | "hora_inicio" | "hora_fin" | "fecha_creacion"
  > {}

export interface I_DailyPartMO {
  daily_part_id: number;
  workforces_id: number[];
}

export interface I_UpdateDailyPartBody {
  hora_parcial: number;
  hora_normal: number;
  hora_60: number;
  hora_100: number;
}
