import { T_FindAllDailyPartResource } from "./models/dailyPartResource.types";
import {
  I_UpdateDailyPartResourcesBD,
} from "./models/dailyPartResources.interface";

export abstract class DailyPartResourceRepository {
  createDailyPartResources(
    ids: number[],
    project_id: number,
    daily_part_id: number
  ): void {}

  updateDailyPartResources(
    data: I_UpdateDailyPartResourcesBD,
    daily_part_resources_id: number
  ): void {}

  findById(daily_part_resource_id: number): void {}

  findAll(
    skip: number,
    data: T_FindAllDailyPartResource,
    project_id: number,
    daily_part_id: number
  ): void {}

  delete(daily_part_resource_id: number): void {}

  findAllWithOutPaginationForDailyPart(daily_part_id:number):void{}

  findAllWithOutPaginationForIdsDailyPart(ids:number[]):void{}
}
