import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaTrainReportRepository } from "./prisma-trainReport.repository";

class TrainReportValidation {
  async findByCode(train_id: number): Promise<T_HttpResponse> {
    try {
      const trainReport = await prismaTrainReportRepository.findById(train_id);
      if (!trainReport) {
        return httpResponse.NotFoundException(
          "Reporte Tren no encontrado",
          trainReport
        );
      }
      return httpResponse.SuccessResponse(
        "Reporte Tren encontrado",
        trainReport
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Reporte Tren",
        error
      );
    }
  }
}

export const trainReportValidation = new TrainReportValidation();
