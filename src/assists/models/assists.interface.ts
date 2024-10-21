import { Asistencia } from "@prisma/client";

export interface I_CreateAssistsWorkforceBD
  extends Omit<Asistencia, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateAssistsWorkforceBody
  extends Omit<Asistencia, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_AssistsWorkforce extends Omit<Asistencia, "eliminado"> {}

export interface I_UpdateAssitsBD
  extends Omit<Asistencia, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_AssistsBody {
  fecha: string;
  horas_60: number;
  horas_100: number;
  asistencia: string;
  horas_extras_estado: string;
  mano_obra_id: number;
}
