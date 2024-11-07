import { projectValidation } from "src/project/project.validation";
import { I_DailyPartCreateBody } from "./models/dailyPart.interface";
import { httpResponse, T_HttpResponse } from "src/common/http.response";
import { dailyPartReportValidation } from "./dailyPart.validation";
import { ParteDiario } from "@prisma/client";
import { prismaDailyPartRepository } from "./prisma-dailyPart.repository";
import { converToDate } from "src/common/utils/date";
import { jobValidation } from "src/job/job.validation";
import prisma from "src/config/prisma.config";

class DailyPart {
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
      const date = converToDate(data.fecha);
      date.setUTCHours(0, 0, 0, 0);
      const lastDailyPartResponse = lastDailyPart.payload as ParteDiario;
      const nextCodigo = (parseInt(lastDailyPartResponse?.codigo) || 0) + 1;
      const formattedCodigo = nextCodigo.toString().padStart(3, "0");
      const dailyPartFormat = {
        codigo: formattedCodigo,
        nombre: formattedCodigo + "-" + date.getFullYear(),
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
