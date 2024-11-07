import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDepartureReportRepository } from "./prisma-reportDeparture.repository";

class DepartureReportValidation {
  async findById(departure_id: number): Promise<T_HttpResponse> {
    try {
      const departureReport = await prismaDepartureReportRepository.findById(
        departure_id
      );
      if (!departureReport) {
        return httpResponse.NotFoundException(
          "Reporte Partida no encontrado",
          departureReport
        );
      }
      return httpResponse.SuccessResponse(
        "Reporte Partida encontrado",
        departureReport
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Reporte Partida",
        error
      );
    }
  }
}

export const departureReportValidation = new DepartureReportValidation();
