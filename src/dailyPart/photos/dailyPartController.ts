import multer from "multer";
import {
  DailyPartPhotoFourMulterFile,
  DailyPartPhotoOneMulterFile,
  DailyPartPhotoThreeMulterFile,
  DailyPartPhotoTwoMulterFile,
} from "./models/photos-contant";
import { httpResponse } from "../../common/http.response";
import express from "../../config/express.config";
import { authService } from "../../auth/auth.service";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { ParteDiario } from "@prisma/client";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import validator from "validator";
import fs from "fs/promises";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DailyPartPhotosController {
  put = async (request: express.Request, response: express.Response) => {
    //[note] es muy bueno manejar esto así si vienen varias fotos ya q lo estaba haciendo individual y era mucho código
    upload.fields([
      { name: DailyPartPhotoOneMulterFile.field, maxCount: 1 },
      { name: DailyPartPhotoTwoMulterFile.field, maxCount: 1 },
      { name: DailyPartPhotoThreeMulterFile.field, maxCount: 1 },
      { name: DailyPartPhotoFourMulterFile.field, maxCount: 1 },
    ])(request, response, async (error: any) => {
      if (error) {
        const customError = httpResponse.BadRequestException(
          "Error al procesar las imágenes del Parte Diario",
          error
        );
        return response.status(customError.statusCode).json(customError);
      } else {
        const daily_part_id = request.params.id;

        if (!validator.isNumeric(daily_part_id)) {
          const customError = httpResponse.BadRequestException(
            "El id del Parte Diario debe ser numérico",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          const rolsPermitted = [
            "ADMIN",
            "USER",
            "CONTROL_COSTOS",
            "ASISTENTE_CONTROL_COSTOS",
            "INGENIERO_PRODUCCION",
            "ASISTENTE_PRODUCCION",
          ];
          const responseValidate = authService.authorizeRolesService(
            request.get("Authorization") as string,
            rolsPermitted
          );

          if (!responseValidate?.success) {
            return response.status(401).json(responseValidate);
          } else {
            const dailyPartResponse =
              await dailyPartReportValidation.findByIdValidation(
                +daily_part_id
              );
            if (!dailyPartResponse.success) {
              return response
                .status(dailyPartResponse.statusCode)
                .json(dailyPartResponse);
            }

            //[note] cuando hago [0] esto se debe xq cada campo de archivo es un array (por eso especifique hasta uno nomás que puede vernir)
            //[note] por eso a la primera posición. Sin poner eso se querría acceder al array completo

            const dailyPart = dailyPartResponse.payload as ParteDiario;

            //[message] Proceso la primera foto
            if (
              request.files &&
              (request.files as any)[DailyPartPhotoOneMulterFile.field]
            ) {
              const fileOne = (request.files as any)[
                DailyPartPhotoOneMulterFile.field
              ][0];
              const directionOne = path.join(
                appRootPath.path,
                "static",
                DailyPartPhotoOneMulterFile.folder
              );
              const fileNameOne = `${dailyPart.id}_photo_1.png`;
              const filePathOne = path.join(directionOne, fileNameOne);

              await sharp(fileOne.buffer)
                .resize({ width: 800 })
                .toFormat("png")
                .toFile(filePathOne);
            }

            //[message] Proceso la segunda foto
            if (
              request.files &&
              (request.files as any)[DailyPartPhotoTwoMulterFile.field]
            ) {
              const fileTwo = (request.files as any)[
                DailyPartPhotoTwoMulterFile.field
              ][0];
              const directionTwo = path.join(
                appRootPath.path,
                "static",
                DailyPartPhotoTwoMulterFile.folder
              );
              const fileNameTwo = `${dailyPart.id}_photo_2.png`;
              const filePathTwo = path.join(directionTwo, fileNameTwo);

              await sharp(fileTwo.buffer)
                .resize({ width: 800 })
                .toFormat("png")
                .toFile(filePathTwo);
            }
            //[message] Proceso la tercera foto
            if (
              request.files &&
              (request.files as any)[DailyPartPhotoThreeMulterFile.field]
            ) {
              const fileThree = (request.files as any)[
                DailyPartPhotoThreeMulterFile.field
              ][0];
              const directionTwo = path.join(
                appRootPath.path,
                "static",
                DailyPartPhotoThreeMulterFile.folder
              );
              const fileNameThree = `${dailyPart.id}_photo_3.png`;
              const filePathThree = path.join(directionTwo, fileNameThree);

              await sharp(fileThree.buffer)
                .resize({ width: 800 })
                .toFormat("png")
                .toFile(filePathThree);
            }
            //[message] Proceso la cuarta foto
            if (
              request.files &&
              (request.files as any)[DailyPartPhotoFourMulterFile.field]
            ) {
              const fileFour = (request.files as any)[
                DailyPartPhotoFourMulterFile.field
              ][0];
              const directionTwo = path.join(
                appRootPath.path,
                "static",
                DailyPartPhotoFourMulterFile.folder
              );
              const fileNameFour = `${dailyPart.id}_photo_4.png`;
              const filePathFour = path.join(directionTwo, fileNameFour);

              await sharp(fileFour.buffer)
                .resize({ width: 800 })
                .toFormat("png")
                .toFile(filePathFour);
            }

            const resultSuccess = httpResponse.SuccessResponse(
              "Imágenes guardadas correctamente"
            );
            return response
              .status(resultSuccess.statusCode)
              .json(resultSuccess);
          }
        }
      }
    });
  };

  deleteImage = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const daily_part_id = request.params.id;

      const number_photo = request.params.number;

      const rolsPermitted = [
        "ADMIN",
        "USER",
        "CONTROL_COSTOS",
        "ASISTENTE_CONTROL_COSTOS",
        "INGENIERO_PRODUCCION",
        "ASISTENTE_PRODUCCION",
      ];
      const responseValidate = authService.authorizeRolesService(
        request.get("Authorization") as string,
        rolsPermitted
      );

      if (!responseValidate?.success) {
        return response.status(401).json(responseValidate);
      } else {
        if (
          !validator.isNumeric(daily_part_id) ||
          !validator.isNumeric(number_photo)
        ) {
          const customError = httpResponse.BadRequestException(
            "El id del Parte Diario o del número de la foto debe ser numérico"
          );
          response.status(customError.statusCode).json(customError);
        } else {
          const dailyPartResponse =
            await dailyPartReportValidation.findByIdValidation(+daily_part_id);
          if (!dailyPartResponse.success) {
            return response
              .status(dailyPartResponse.statusCode)
              .json(dailyPartResponse);
          }

          const dailyPart = dailyPartResponse.payload as ParteDiario;
          let fileName = "";
          let filePath = "";
          let direction = "";
          if (Number(number_photo) === 1) {
            direction = path.join(
              appRootPath.path,
              "static",
              DailyPartPhotoOneMulterFile.folder
            );
            fileName = `${dailyPart.id}_photo_${number_photo}.png`;
            filePath = path.join(direction, fileName);
          } else if (Number(number_photo) === 2) {
            direction = path.join(
              appRootPath.path,
              "static",
              DailyPartPhotoTwoMulterFile.folder
            );
            fileName = `${dailyPart.id}_photo_${number_photo}.png`;
            filePath = path.join(direction, fileName);
          } else if (Number(number_photo) === 3) {
            direction = path.join(
              appRootPath.path,
              "static",
              DailyPartPhotoThreeMulterFile.folder
            );
            fileName = `${dailyPart.id}_photo_${number_photo}.png`;
            filePath = path.join(direction, fileName);
          } else if (Number(number_photo) === 4) {
            direction = path.join(
              appRootPath.path,
              "static",
              DailyPartPhotoFourMulterFile.folder
            );
            fileName = `${dailyPart.id}_photo_${number_photo}.png`;
            filePath = path.join(direction, fileName);
          } else {
            const customError = httpResponse.NotFoundException(
              "El número ingresado del campo foto no es válido"
            );
            response.status(customError.statusCode).json(customError);
          }

          try {
            await fs.access(filePath);

            // Eliminar el archivo
            await fs.unlink(filePath);

            response.status(200).json({
              success: true,
              message: "Imagen eliminada correctamente",
            });
          } catch (err) {
            const customError = httpResponse.NotFoundException(
              "La imagen no existe o ya fue eliminada",
              err
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    } catch (error) {
      const customError = httpResponse.BadRequestException(
        "Error al intentar eliminar la imagen del Parte Diario",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export const dailyPartPhotosController = new DailyPartPhotosController();
