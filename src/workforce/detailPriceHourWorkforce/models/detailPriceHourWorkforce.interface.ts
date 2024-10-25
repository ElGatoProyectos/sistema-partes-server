import { DetallePrecioHoraMO } from "@prisma/client";

export interface I_CreateDetailPriceHourWorkforceBD
  extends Omit<DetallePrecioHoraMO, "id" | "eliminado"> {}
