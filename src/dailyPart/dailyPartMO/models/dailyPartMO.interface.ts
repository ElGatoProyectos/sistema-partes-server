import { ParteDiarioMO } from "@prisma/client";
import {
  I_JobAndCategoryWorkforce,
  I_JobAndCategoryWorkforceForPdf,
} from "../../../job/models/job.interface";

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

export interface I_CategoriaObrero {
  id: number;
  nombre: string;
  fecha_creacion: Date;
  eliminado: string;
  proyecto_id: number;
}

export interface I_Mano {
  CategoriaObrero: I_CategoriaObrero;
}
export interface I_DailyPartWorkforce extends ParteDiarioMO {
  ManoObra: I_JobAndCategoryWorkforce;
}
export interface I_DailyPartWorkforcePdf extends ParteDiarioMO {
  ManoObra: I_JobAndCategoryWorkforceForPdf;
}

export interface I_DailyPartBody {
  hora_inicio: number;
  hora_fin: number;
  hora_parcial: number;
  hora_normal: number;
  hora_60: number;
  hora_100: number;
  parte_diario_id: number;
  mano_obra_id: number;
  fecha_creacion: Date;
  proyecto_id: number;
  ManoObra: I_Mano;
}

export interface DailyPartPdf {
  documento_identidad: string;
  nombre_completo: string | undefined;
  categoria_obrero: string | undefined;
  unidad: string | undefined;
  horas_trabajadas: number;
  hora_normal: number;
  hora_60: number;
  hora_100: number;
}
