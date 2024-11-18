import {
  I_CreateDetailPhotosBD,
  I_UpdateDetailPhotosBD,
} from "./models/dailyPart.interface";

export abstract class DailyPartPhotoRepository {
  createDailyPartPhotos(data: I_CreateDetailPhotosBD): void {}

  updateDailyPartPhotos(
    data: I_UpdateDetailPhotosBD,
    detail_daily_part_photo_id: number
  ): void {}

  findByDetailForDailyPart(daily_part_id: number): void {}

  findComentaryOfDetail(daily_part_id: number): void {}
}
