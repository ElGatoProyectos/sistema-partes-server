import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { weekValidation } from "../week.validation";
import { Proyecto, Semana } from "@prisma/client";
import { prismaDetailWeekProjectRepository } from "./prisma-detailWeekProject.repository";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { converToDate } from "@/common/utils/date";

class DetailWeekProjectService {
  async createDetails(project: Proyecto): Promise<T_HttpResponse> {
    try {
      const date = converToDate("2025-09-14 03:00:00.000");

      const weekDateResponse = await weekValidation.findByDate(date);
      console.log(weekDateResponse);
      const weekDate = weekDateResponse.payload as Semana;
      const weekResponse = await weekValidation.findAll(date.getFullYear());
      const weekAll = weekResponse.payload as Semana[];

      let reachedCurrentWeek = false;
      // for (let index = 0; index < weekAll.length; index++) {
      //   const isCurrentWeek = weekAll[index].codigo === weekDate.codigo;

      //   if (isCurrentWeek) {
      //     reachedCurrentWeek = true;
      //   }

      //   const detailFormat = {
      //     semana_id: weekAll[index].id,
      //     empresa_id: project.empresa_id,
      //     proyecto_id: project.id,
      //     cierre: !reachedCurrentWeek,
      //   };

      //   // await prismaDetailWeekProjectRepository.createDetail(detailFormat);
      // }

      return httpResponse.SuccessResponse(
        "Se creó correctamente el Detalle Semana Proyecto"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Detalle Semana Proyecto",
        error
      );
    }
  }
  async findAll(project_id: string) {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaDetailWeekProjectRepository.findAll(
        +project_id
      );
      const date = new Date();
      const weekDateResponse = await weekValidation.findByDate(date);
      if (!result) {
        return httpResponse.SuccessResponse(
          "No se encontraron detalles de la Semana del Proyecto"
        );
      }
      const weekDate = weekDateResponse.payload as Semana;
      const detailsNewFormat = result.detailsNewFormat || [];
      const modifiedData = detailsNewFormat.map((item) => {
        const itemNew = { ...item };
        if (itemNew.semana === weekDate.codigo) {
          return {
            ...itemNew,
            actual: true,
          };
        }
        return {
          ...itemNew,
          actual: false,
        };
      });

      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Detalles de la Semana del Proyecto",
        modifiedData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Detalles de la Semana del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const detailWeekProjectService = new DetailWeekProjectService();
