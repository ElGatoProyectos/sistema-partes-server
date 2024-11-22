import { ParteDiario, ParteDiarioRecurso } from "@prisma/client";
import { I_Recurso } from "../../../resources/models/resources.interface";

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

export interface I_DailyPartResource extends ParteDiarioRecurso {
  Recurso: I_Recurso;
  ParteDiario: ParteDiario;
}
