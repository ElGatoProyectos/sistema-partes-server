import { ParteDiarioPartida } from "@prisma/client";

export interface UpdateDailyPartDeparture
  extends Omit<ParteDiarioPartida, "id"> {}

export interface I_DailyPartDepartureBody {
  cuantity_used: number;
}
