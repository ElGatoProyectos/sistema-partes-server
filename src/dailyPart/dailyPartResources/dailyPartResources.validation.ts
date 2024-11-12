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
}

export const dailyPartResourceValidation = new DailyPartResourceValidation();
