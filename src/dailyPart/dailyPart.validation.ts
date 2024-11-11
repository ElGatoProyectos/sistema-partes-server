import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaDailyPartRepository } from "./prisma-dailyPart.repository";

class DailyPartReportValidation {
  async findByIdValidation(daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.findByIdValidation(
        daily_part_id
      );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Parte Diario no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario",
        error
      );
    }
  }

  async findByRiskId(risk_daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.findByIdRisk(
        risk_daily_part_id
      );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "En los Partes Diarios el id del Riesgo no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "Fue encontrado el Parte Diario por el id del Riesgo proporcionado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario por el id del Riesgo proporcionado",
        error
      );
    }
  }
  //[validation] esto se usa cuando quiero eliminar un trabajo y me acá si hay algo en Parte Diario
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
  async updateDailyPartForRisk(
    daily_part_id: number,
    risk_daily_part_id: number | null
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.updateDailyParForRisk(
        daily_part_id,
        risk_daily_part_id
      );
      if (!dailyPart) {
        return httpResponse.SuccessResponse(
          "No se pudo editar el Parte Diario para introducirle su Riesgo"
        );
      }
      return httpResponse.SuccessResponse(
        "Parte Diario fue editado con éxito correctamente con su Riesgo",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error editar el Parte Diario para introducir el Riesgo ",
        error
      );
    }
  }
}

export const dailyPartReportValidation = new DailyPartReportValidation();
