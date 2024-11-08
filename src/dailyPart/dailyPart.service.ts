import { projectValidation } from "../project/project.validation";
import { I_DailyPartCreateBody } from "./models/dailyPart.interface";
import { dailyPartReportValidation } from "./dailyPart.validation";
import { ParteDiario, Trabajo } from "@prisma/client";
import { prismaDailyPartRepository } from "./prisma-dailyPart.repository";
import { converToDate } from "../common/utils/date";
import { jobValidation } from "../job/job.validation";
import prisma from "../config/prisma.config";
import { httpResponse, T_HttpResponse } from "../common/http.response";

class DailyPartService {
  async createDailyPart(
    data: I_DailyPartCreateBody,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
      const lastDailyPart = await dailyPartReportValidation.codeMoreHigh(
        project_id,
        data.job_id
      );
      const jobResponse = await jobValidation.findById(data.job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }
      const job = jobResponse.payload as Trabajo;
      const date = converToDate(data.fecha);
      date.setUTCHours(0, 0, 0, 0);
      const lastDailyPartResponse = lastDailyPart.payload as ParteDiario;
      const nextCodigo = (parseInt(lastDailyPartResponse?.codigo) || 0) + 1;
      const formattedCodigo = nextCodigo.toString().padStart(4, "0");
      const dailyPartFormat = {
        codigo: formattedCodigo,
        nombre: job.codigo + "-" + formattedCodigo,
        proyecto_id: project_id,
        trabajo_id: data.job_id,
        fecha: date,
      };
      const responseDailyPart = await prismaDailyPartRepository.createDailyPart(
        dailyPartFormat
      );
      return httpResponse.CreatedResponse(
        "Parte Diario creado correctamente",
        responseDailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const dailyPartService = new DailyPartService();
