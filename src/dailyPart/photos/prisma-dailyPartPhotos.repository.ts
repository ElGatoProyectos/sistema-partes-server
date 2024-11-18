import { DetalleParteDiarioFoto } from "@prisma/client";
import { DailyPartPhotoRepository } from "./dailyPartPhotos.repository";
import {
  I_CreateDetailPhotosBD,
  I_UpdateDetailPhotosBD,
} from "./models/dailyPart.interface";
import prisma from "../../config/prisma.config";

class PrismaDailyPartPhotoRepository implements DailyPartPhotoRepository {
  async createDailyPartPhotos(
    data: I_CreateDetailPhotosBD
  ): Promise<DetalleParteDiarioFoto | null> {
    const detail = await prisma.detalleParteDiarioFoto.create({
      data: data,
    });
    return detail;
  }
  async updateDailyPartPhotos(
    data: I_UpdateDetailPhotosBD,
    detail_daily_part_photo_id: number
  ): Promise<DetalleParteDiarioFoto | null> {
    const detail = await prisma.detalleParteDiarioFoto.update({
      where: {
        id: detail_daily_part_photo_id,
      },
      data: data,
    });
    return detail;
  }
  async findByDetailForDailyPart(
    daily_part_id: number
  ): Promise<DetalleParteDiarioFoto | null> {
    const detail = await prisma.detalleParteDiarioFoto.findFirst({
      where: {
        parte_diario_id: daily_part_id,
      },
    });
    return detail;
  }
}

export const prismaDailyPartPhotoRepository =
  new PrismaDailyPartPhotoRepository();
