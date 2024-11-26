import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDailyPartPhotoRepository } from "./prisma-dailyPartPhotos.repository";

class DailyPartPhotoValidation {
  async findByIdValidation(daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart =
        await prismaDailyPartPhotoRepository.findByDetailForDailyPart(
          daily_part_id
        );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Detalle Parte Diario Foto no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "El Detalle Parte Diario Foto fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario Foto por los ids de los Partes Diarios",
        error
      );
    }
  }
  async findAllForIdDailyPart(
    daily_part_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart =
        await prismaDailyPartPhotoRepository.findAllWithOutPaginationForIdDailyPart(
          daily_part_id
        );

      return httpResponse.SuccessResponse(
        "El Detalle Parte Diario Foto por id del Parte Diario",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Parte Diario Foto por id del Parte Diario",
        error
      );
    }
  }
  async findAllForIdsDailyParts(
    idsDailyPart: number[]
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart =
        await prismaDailyPartPhotoRepository.findAllForIdsDailyPart(
          idsDailyPart
        );

      return httpResponse.SuccessResponse(
        "El Detalle Parte Diario Foto por los ids de los Partes Diarios fueron encontrados",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario Foto por los ids de los Partes Diarios fueron encontrados",
        error
      );
    }
  }
}

export const dailyPartPhotoValidation = new DailyPartPhotoValidation();
