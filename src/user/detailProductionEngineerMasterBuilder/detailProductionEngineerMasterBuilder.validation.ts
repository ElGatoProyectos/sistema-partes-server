import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "./prismaDetailProductionEngineerMasterBuilder.repository";

class DetailDetailProductionEngineerMasterBuilderValidation {
  async findByIdUserDetailProductionEngineerMasterBuilder(
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailProductionEngineerMasterBuilderRepository.verifyIdDetailProductionEngineerMasterBuilder(
          user_id
        );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Usuario no fue encontrado en el Detalle Ingeniero Producción- Maestro Obra"
        );
      }
      return httpResponse.SuccessResponse(
        "Id Usuario fue encontrado en el Detalle Ingeniero Producción- Maestro Obra",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Detalle Ingeniero Producción- Maestro Obra",
        error
      );
    }
  }
}

export const detailDetailProductionEngineerMasterBuilderValidation =
  new DetailDetailProductionEngineerMasterBuilderValidation();
