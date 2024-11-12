import { ParteDiarioRecurso } from "@prisma/client";

export interface I_CreateDailyPartResourcesBD
  extends Omit<ParteDiarioRecurso, "id" | "fecha_creacion"> {}

export interface I_UpdateDailyPartResourcesBD
  extends Omit<ParteDiarioRecurso, "id" | "fecha_creacion"> {}

export interface I_CreateDailyPartResourceBody {
  resources_id: number[];
}
export interface I_UpdateDailyPartResourceBody {
  resource_id: number;
  amount: number;
}
