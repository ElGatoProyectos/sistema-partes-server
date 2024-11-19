import { ParteDiarioPartida } from "@prisma/client";
import { I_DailyPart } from "../../models/dailyPart.interface";

export interface UpdateDailyPartDeparture
  extends Omit<ParteDiarioPartida, "id"> {}

export interface I_DailyPartDepartureBody {
  quantity_used: number;
}

export interface I_DailyPartDeparture {
  id: number;
  parte_diario_id: number;
  partida_id: number;
  cantidad_utilizada: number;
  ParteDiario: I_DailyPart;
}
