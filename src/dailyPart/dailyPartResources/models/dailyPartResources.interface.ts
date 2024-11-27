import { ParteDiario, ParteDiarioRecurso } from "@prisma/client";
import { I_Recurso, I_RecursoForPdf } from "../../../resources/models/resources.interface";
import { I_ProjectForID } from "../../../project/models/project.interface";
import { I_DailyPart, I_ParteDiarioPdf } from "../../models/dailyPart.interface";

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
  ParteDiario: I_DailyPart;
}
export interface I_DailyPartResourceForPdf extends ParteDiarioRecurso {
  Recurso: I_RecursoForPdf;
  ParteDiario: ParteDiario;
}
