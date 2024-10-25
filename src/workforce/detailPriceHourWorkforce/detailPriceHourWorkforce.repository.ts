import { I_CreateDetailPriceHourWorkforceBD } from "./models/detailPriceHourWorkforce.interface";

export abstract class DetailPriceHoueWorkforceRepository {
  findByIdCategoryWorkforce(categoryWorkforce_id: number): void {}

  createDetailPriceHourWorkforce(
    data: I_CreateDetailPriceHourWorkforceBD[]
  ): void {}
}
