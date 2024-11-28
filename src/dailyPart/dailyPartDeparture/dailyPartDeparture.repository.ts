import { UpdateDailyPartDeparture } from "./models/dailyPartDeparture.interface";
import { T_FindAllDailyPartDeparture } from "./models/dailyPartDeparture.types";

export abstract class DailyPartDepartureRepository {
  createDailyPartDeparture(
    ids_departure: number[],
    daily_part_id: number
  ): void {}

  updateDailyPartDeparture(
    data: UpdateDailyPartDeparture,
    daily_part_departure_id: number
  ): void {}

  findById(daily_part_departure_id: number): void {}

  findByIdDailyPartAndDeparture(
    daily_part_id: number,
    departure_id: number
  ): void {}
  findAllForDailyPart(daily_part_id: number): void {}

  findAllForDailyPartDeparture(
    skip: number,
    data: T_FindAllDailyPartDeparture,
    daily_part_id: number
  ): void {}

  findAllWithOutPaginationForidDailyPart(daily_part_id: number): void {}

  findAllWithOutPaginationForidsDailyPart(idsDailyPart: number[]): void {}
}
