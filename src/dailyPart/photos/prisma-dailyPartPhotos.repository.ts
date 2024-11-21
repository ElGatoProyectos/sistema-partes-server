import { DetalleParteDiarioFoto } from "@prisma/client";
import { DailyPartPhotoRepository } from "./dailyPartPhotos.repository";
import {
  I_CreateDetailPhotosBD,
  I_CreateDetailPhotosBody,
  I_UpdateDetailPhotosBD,
  ResponseDetailPhotosBody,
} from "./models/dailyPart.interface";
import prisma from "../../config/prisma.config";

class PrismaDailyPartPhotoRepository implements DailyPartPhotoRepository {
  async findAllForIdsDailyPart(
    idsDailyPart: number[]
  ): Promise<DetalleParteDiarioFoto[] | null> {
    const details = await prisma.detalleParteDiarioFoto.findMany({
      where: {
        ParteDiario: {
          id: {
            in: idsDailyPart,
          },
        },
      },
    });
    return details;
  }
  async findComentaryOfDetail(
    daily_part_id: number
  ): Promise<DetalleParteDiarioFoto | null> {
    const detail = prisma.detalleParteDiarioFoto.findFirst({
      where: {
        parte_diario_id: daily_part_id,
      },
    });
    return detail;
  }
  async createDailyPartPhotos(
    data: I_CreateDetailPhotosBD
  ): Promise<DetalleParteDiarioFoto | null> {
    console.log("------------");
    console.log(data);
    const detail = await prisma.detalleParteDiarioFoto.create({
      data: data,
    });
    console.log(detail);
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
  ): Promise<ResponseDetailPhotosBody | null> {
    const detail = await prisma.detalleParteDiarioFoto.findFirst({
      where: {
        parte_diario_id: daily_part_id,
      },
    });
    return {
      id: detail?.id ? detail.id : null,
      comentary_one: detail?.comentario_uno ? detail?.comentario_uno : "",
      comentary_two: detail?.comentario_dos ? detail?.comentario_dos : "",
      comentary_three: detail?.comentario_tres ? detail?.comentario_tres : "",
      comentary_four: detail?.comentario_cuatro
        ? detail?.comentario_cuatro
        : "",
    };
  }
}

export const prismaDailyPartPhotoRepository =
  new PrismaDailyPartPhotoRepository();
