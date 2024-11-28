import { Semana } from "@prisma/client";
import { httpResponse } from "../../common/http.response";
import { projectValidation } from "../../project/project.validation";
import { weekValidation } from "../../week/week.validation";
import { T_FindAllTrainReport } from "./models/trainReport.types";
import { prismaTrainReportRepository } from "./prisma-trainReport.repository";
import { I_ProjectForID } from "../../project/models/project.interface";
import prisma from "../../config/prisma.config";

class TrainReportService {
  async findAll(data: T_FindAllTrainReport, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const project = projectResponse.payload as I_ProjectForID;
      if (data.queryParams.week) {
        const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
          String(i + 1).padStart(2, "0")
        );
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }
      const result = await prismaTrainReportRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { reportsTrains, total, week } = result;
      if (reportsTrains.length === 0 && data.queryParams.week) {
        const reportFormat = {
        //   tren_id: project.Trabajo.Tren.nombre,
          costo_total: 0,
          ejecutado_anterior: 0,
          ejecutado_actual: 0,
          lunes: 0,
          martes: 0,
          miercoles: 0,
          jueves: 0,
          viernes: 0,
          sabado: 0,
          domingo: 0,
          parcial: 0,
          semana_id: week.codigo,
        };
        const formData = {
          total:1,
          page: data.queryParams.page,
          // x ejemplo 20
          limit: data.queryParams.limit,
          //cantidad de paginas que hay
          pageCount: 1,
          data: reportFormat,
        };
        return httpResponse.SuccessResponse(
          "Éxito al traer todos los Reporte de los Trenes",
          formData
        );
      }
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: reportsTrains,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Reporte de los Trenes",
        formData
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Reporte de los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const trainReportService = new TrainReportService();
