import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDetailWeekProjectRepository } from "./prisma-detailWeekProject.repository";
import { I_UpdateDetailWeekProject } from "./models/detailWeekProject.interface";

class DetailWeekProjectValidation {
  async findByIdProject(project_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailWeekProjectRepository.findByIdProject(
        project_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "El Detalle Semana Proyecto fue no fue encontrado",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "El Detalle Semana Proyecto fue encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Detalle Semana Proyecto",
        error
      );
    }
  }
  async updateProjectsForYear(
    data: I_UpdateDetailWeekProject[],
    week: number
  ): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailWeekProjectRepository.updateDetailMany(
        data,
        week
      );

      return httpResponse.SuccessResponse(
        "Los Detalles Semana Proyecto del Año fueron modificados",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar los Detalles Semana Proyecto del Año",
        error
      );
    }
  }
  async findByIdWeek(week_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailWeekProjectRepository.findIdWeek(
        week_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "El Detalle Semana Proyecto fue no fue encontrado por la semana que paso",
          detail
        );
      }
      return httpResponse.SuccessResponse(
        "El Detalle Semana Proyecto fue encontrado por la semana que pasó",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Detalle Semana Proyecto por semana",
        error
      );
    }
  }
  async findAllForYear(date: Date): Promise<T_HttpResponse> {
    try {
      const details = await prismaDetailWeekProjectRepository.findAllForYear(
        date
      );
      if (!details) {
        return httpResponse.NotFoundException(
          "Los Detalles Semana Proyecto por año no fue no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Los Detalles Semana Proyecto por el año que paso fue encontrado",
        details
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Detalles Semana Proyecto por el año que pasó",
        error
      );
    }
  }
}

export const detailWeekProjectValidation = new DetailWeekProjectValidation();
