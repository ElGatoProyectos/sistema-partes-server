import { ParteDiario } from "@prisma/client";
import { dailyPartReportValidation } from "../dailyPart.validation";
import appRootPath from "app-root-path";
import { DailyPartPhotoTwoMulterFile } from "./models/photos-contant";

import fs from "fs/promises";
import { httpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";

class PhotoService {
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
export const protoService = new PhotoService();
