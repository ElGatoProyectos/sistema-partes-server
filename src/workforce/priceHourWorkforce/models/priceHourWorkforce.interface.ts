import { PrecioHoraMO } from "@prisma/client";

export interface I_CreatePriceHourWorkforceBD
  extends Omit<PrecioHoraMO, "id" | "fecha_creacion"> {}

export interface I_UpdatePriceHourWorkforceBody
  extends Omit<PrecioHoraMO, "id"> {}

export interface I_PriceHourWorkforceAll
  extends Omit<PrecioHoraMO, "eliminado"> {}

export interface I_PriceHourWorkforce {
  fecha_inicio: string;
  fecha_fin: string;
  nombre: string;
  data: PriceHourWorkforceBody[];
}

export interface PriceHourWorkforceBody {
  hora_normal: number;
  hora_extra_60: number;
  hora_extra_100: number;
  categoria_obrero_id: number;
  precio_hora_mo_id: number;
}
