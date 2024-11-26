import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { I_CreateReportTrainBD, I_UpdateReportTrainBD } from "./models/trainReport.interface";
import { prismaTrainReportRepository } from "./prisma-trainReport.repository";

class TrainReportValidation {
  async create(data: I_CreateReportTrainBD): Promise<T_HttpResponse> {
    try {
      const trainReport = await prismaTrainReportRepository.createReportsForTrain(data);
      if (!trainReport) {
        return httpResponse.NotFoundException(
          "No se pudo crear Reporte por Tren",
          trainReport
        );
      }
      return httpResponse.SuccessResponse(
        "Reporte por Tren creado con éxito",
        trainReport
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Reporte por Tren",
        error
      );
    }
  }
  async update(report_train_id:number,value: number,field:string): Promise<T_HttpResponse> {
    try {
      const trainReport = await prismaTrainReportRepository.updateReportsForTrain(report_train_id,value,field);
      if (!trainReport) {
        return httpResponse.NotFoundException(
          "No se pudo actualizar el Reporte por Tren",
          trainReport
        );
      }
      return httpResponse.SuccessResponse(
        "Reporte por Tren actualizado con éxito",
        trainReport
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el Reporte por Tren",
        error
      );
    }
  }
  async findByIdTrainAndWeek(train_id: number,week_id:number): Promise<T_HttpResponse> {
    try {
      const trainReport = await prismaTrainReportRepository.findByIdTrainAndWeek(train_id,week_id);
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
  async findByIdTrain(train_id: number): Promise<T_HttpResponse> {
    try {
      const trainReport = await prismaTrainReportRepository.findByIdTrain(train_id);
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
