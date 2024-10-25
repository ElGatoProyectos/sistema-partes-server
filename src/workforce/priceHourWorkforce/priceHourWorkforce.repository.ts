import {
  I_CreatePriceHourWorkforceBD,
  I_UpdatePriceHourWorkforceBody,
} from "./models/priceHourWorkforce.interface";
import { T_FindAllPriceHourWorkforce } from "./models/priceHourWorkforce.types";

export abstract class PriceHourRepository {
  findAll(
    skip: number,
    data: T_FindAllPriceHourWorkforce,
    project_id: number
  ): void {}

  createPriceHourWorkforce(data: I_CreatePriceHourWorkforceBD): void {}

  updatePriceHourWorkforce(
    data: I_UpdatePriceHourWorkforceBody,
    price_hour_workforce_id: number
  ): void {}

  findById(price_hour_id: number): void {}
}
