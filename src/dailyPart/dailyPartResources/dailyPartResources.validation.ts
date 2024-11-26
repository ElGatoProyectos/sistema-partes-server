import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDailyPartResourceRepository } from "./prisma-dailyPartRepository.repository";

class DailyPartResourceValidation {
  async findById(daily_part_resource_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartResource =
        await prismaDailyPartResourceRepository.findById(
          daily_part_resource_id
        );
      if (!dailyPartResource) {
        return httpResponse.NotFoundException(
          "El Parte Diario del Recurso no fue encontrado",
          dailyPartResource
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario del Recurso fue encontrado",
        dailyPartResource
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario del Recurso",
        error
      );
    }
  }
  async findAllWithPaginationForDailyPart(daily_part_resource_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartResource =
        await prismaDailyPartResourceRepository.findAllWithOutPaginationForDailyPart(
          daily_part_resource_id
        );
     
      return httpResponse.SuccessResponse(
        "Los Partes Diarios del Recurso por el Parte Diario fueron encontrados",
        dailyPartResource
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios del Recurso por el Parte Diario",
        error
      );
    }
  }
}

export const dailyPartResourceValidation = new DailyPartResourceValidation();
