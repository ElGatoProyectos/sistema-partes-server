import { DetallePrecioHoraMO } from "@prisma/client";

export interface I_CreateDetailPriceHourWorkforceBD
  extends Omit<DetallePrecioHoraMO, "id" | "eliminado"> {}

export interface I_UpdateDetailPriceHourWorkforceBD
  extends Omit<DetallePrecioHoraMO, "id" | "eliminado"> {}
