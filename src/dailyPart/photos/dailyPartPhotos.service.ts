import { DetalleParteDiarioFoto, ParteDiario } from "@prisma/client";
import { dailyPartReportValidation } from "../dailyPart.validation";
import appRootPath from "app-root-path";
import { DailyPartPhotoTwoMulterFile } from "./models/photos-contant";

import fs from "fs/promises";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import {
  I_CreateDetailPhotosBD,
  I_CreateDetailPhotosBody,
} from "./models/dailyPart.interface";
import { prismaDailyPartPhotoRepository } from "./prisma-dailyPartPhotos.repository";
import { dailyPartPhotoValidation } from "./dailyPartPhotos.validation";

class DailyPartPhotoService {
  async updateDetailDailyPartPhoto(
    data: I_CreateDetailPhotosBody,
    daily_part_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return httpResponse.NotFoundException(
          "El Parte Diario no fue encontrado en el cración/actulización de la Restricción",
          dailyPartResponse.payload
        );
      }

      const detailDailyPartPhotoFormat = {
        comentario_uno: data.comentary_one,
        comentario_dos: data.comentary_two,
        comentario_tres: data.comentary_three,
        comentario_cuatro: data.comentary_four,
        parte_diario_id: daily_part_id,
      };

      const detailDailyPartPhotoResponse =
        await dailyPartPhotoValidation.findByIdValidation(daily_part_id);

      if (detailDailyPartPhotoResponse.success) {
        const detailDailyPartPhoto =
          detailDailyPartPhotoResponse.payload as DetalleParteDiarioFoto;

        const responseDailyPartPhotoUpdate =
          await prismaDailyPartPhotoRepository.updateDailyPartPhotos(
            detailDailyPartPhotoFormat,
            detailDailyPartPhoto.id
          );

        return httpResponse.CreatedResponse(
          "Detalle Parte Diario Foto modificado correctamente",
          responseDailyPartPhotoUpdate
        );
      }

      const responseDailyPartPhoto =
        await prismaDailyPartPhotoRepository.createDailyPartPhotos(
          detailDailyPartPhotoFormat
        );

      return httpResponse.CreatedResponse(
        "Detalle Parte Diario Foto creada correctamente",
        responseDailyPartPhoto
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear o modificar el Detalle Parte Diario Foto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findIdImage(daily_part_id: number, photo_number: number) {
    try {
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(+daily_part_id);

      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      const imagePath =
        appRootPath +
        "/static/" +
        DailyPartPhotoTwoMulterFile.folder +
        "/" +
        dailyPart.id +
        "_" +
        "photo" +
        "_" +
        photo_number +
        ".png";

      try {
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return httpResponse.BadRequestException(
          " La Imagen del Parte Diario  no fue encontrada"
        );
      }

      return httpResponse.SuccessResponse("Imagen encontrada", imagePath);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la imagen del Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect;
    }
  }
}
export const dailyPartPhotoService = new DailyPartPhotoService();