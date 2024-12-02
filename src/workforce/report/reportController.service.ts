import { httpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { projectValidation } from "../../project/project.validation";
import { T_FindAlReportlWorkforce } from "./models/reportWorkforce.types";
import { prismaReportWorkforceRepository } from "./prisma-report-workforce.reporitory";


class TrainReportService {
  
  async findAll(data: T_FindAlReportlWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
        String(i + 1).padStart(2, "0")
      );

      if (data.queryParams.week) {
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }

      const result = await prismaReportWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { allResponse, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: allResponse,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer toda la Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer toda la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }


}

export const trainReportService = new TrainReportService();
