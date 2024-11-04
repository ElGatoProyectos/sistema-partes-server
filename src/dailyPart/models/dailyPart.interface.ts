import { ParteDiario } from "@prisma/client";

export interface I_CreateDailyPartBD extends Omit<ParteDiario, "id"> {}
