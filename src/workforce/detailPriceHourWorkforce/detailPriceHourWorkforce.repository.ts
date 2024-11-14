import {
  I_CreateDetailPriceHourWorkforceBD,
  I_UpdateDetailPriceHourWorkforceBD,
} from "./models/detailPriceHourWorkforce.interface";

export abstract class DetailPriceHoueWorkforceRepository {
  findByIdCategoryWorkforce(categoryWorkforce_id: number): void {}

  createDetailPriceHourWorkforce(
    data: I_CreateDetailPriceHourWorkforceBD[]
  ): void {}

  updateDetailPriceHourWorkforce(
    price_hour_id: number,
    data: I_UpdateDetailPriceHourWorkforceBD[]
  ): void {}

  findByIdPriceHourMO(price_hour_id: number): void {}
}
