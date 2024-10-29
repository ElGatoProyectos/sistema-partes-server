import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDetailWeekProjectRepository } from "./prisma-detailWeekProject.repository";

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
}

export const detailWeekProjectValidation = new DetailWeekProjectValidation();
