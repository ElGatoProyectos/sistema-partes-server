import { DetalleSemanaProyecto } from "@prisma/client";

export interface I_CreateDetailWeekProject
  extends Omit<DetalleSemanaProyecto, "id"> {}
export interface I_UpdateDetailWeekProject
  extends Omit<DetalleSemanaProyecto, "id"> {}
