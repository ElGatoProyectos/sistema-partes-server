import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaDailyPartRepository } from "./prisma-dailyPart.repository";

class DailyPartReportValidation {
  async findByIdJob(job_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.findByIdJob(job_id);
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "Parte Diario de acuerdo al Trabajo no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "Parte Diario de acuerdo al Trabajo fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario de acuerdo al Trabajo",
        error
      );
    }
  }
  async codeMoreHigh(
    project_id: number,
    job_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.codeMoreHigh(
        project_id,
        job_id
      );
      if (!dailyPart) {
        return httpResponse.SuccessResponse("No se encontraron resultados", 0);
      }
      return httpResponse.SuccessResponse("Parte Diario encontrado", dailyPart);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Parte Diario",
        error
      );
    }
  }
}

export const dailyPartReportValidation = new DailyPartReportValidation();
