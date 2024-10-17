import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDetailForemanGroupLeaderRepository } from "./prisma-detailForemanGroupLeader.respository";

class DetailForemanGroupLeaderValidation {
  async findByIdUserDetailForemanGroupLeader(
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailForemanGroupLeaderRepository.verifyIdDetailForemanGroupLeader(
          user_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Usuario no fue encontrado en el Detalle Capataz-Jefe Grupo"
        );
      }
      return httpResponse.SuccessResponse(
        "Id Usuario fue encontrado en el Detalle en el Detalle Capataz-Jefe Grupo",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar en el Detalle Capataz-Jefe Grupo",
        error
      );
    }
  }
  async findByIdGroupLeader(
    user_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailForemanGroupLeaderRepository.findByIdGroupLeader(
          user_id,
          project_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Jefe de Grupo no fue encontrado en el Detalle Capataz-Jefe Grupo"
        );
      }
      return httpResponse.SuccessResponse(
        "Id del Jefe de Grupo fue encontrado en el Detalle en el Detalle Capataz-Jefe Grupo",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar en el Detalle Capataz-Jefe Grupo",
        error
      );
    }
  }
}

export const detailForemanGroupLeaderValidation =
  new DetailForemanGroupLeaderValidation();
