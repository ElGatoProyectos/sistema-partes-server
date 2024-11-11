import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaRiskDailyPartRepository } from "./prisma-riskDailyPart.repository";

class RiskDailyPartReportValidation {
  async findById(restriction_daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaRiskDailyPartRepository.findById(
        restriction_daily_part_id
      );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Riesgo Parte Diario no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "El Riesgo Parte Diario fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Riesgo Parte Diario",
        error
      );
    }
  }
}

export const riskDailyPartReportValidation =
  new RiskDailyPartReportValidation();
