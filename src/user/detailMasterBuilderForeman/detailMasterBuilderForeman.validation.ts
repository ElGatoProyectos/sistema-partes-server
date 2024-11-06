import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDetailMasterBuilderForemanRepository } from "./prismaDetailMasterBuilderForeman.repository";

class DetailMasterBuilderForemanValidation {
  async findByIdUserDetailMasterBuilderForeman(
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailMasterBuilderForemanRepository.verifyIdDetailMasterBuilderForeman(
          user_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Usuario no fue encontrado en el Detalle Maestro Obra-Capataz"
        );
      }
      return httpResponse.SuccessResponse(
        "Id Usuario fue encontrado en el Detalle en el Detalle Maestro Obra-Capataz",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar en el Detalle Maestro Obra-Capataz",
        error
      );
    }
  }
  async findByIdForeman(
    user_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailMasterBuilderForemanRepository.findByIdForeman(
          user_id,
          project_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Capataz no fue encontrado en el Detalle Maestro Obra-Capataz"
        );
      }
      return httpResponse.SuccessResponse(
        "Id del Capataz fue encontrado en el Detalle en el Detalle Maestro Obra-Capataz",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar en el Detalle Maestro Obra-Capataz",
        error
      );
    }
  }
}

export const detailMasterBuilderForemanValidation =
  new DetailMasterBuilderForemanValidation();
