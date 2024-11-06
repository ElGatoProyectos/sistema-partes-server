import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDetailPriceHourWorkforceRepository } from "./prisma-detailPriceHourWorkforce.repository";

class DetailPriceHourWorkforceValidation {
  async findById(category_workforce_id: number): Promise<T_HttpResponse> {
    try {
      const detail =
        await prismaDetailPriceHourWorkforceRepository.findByIdCategoryWorkforce(
          category_workforce_id
        );
      if (!detail)
        return httpResponse.NotFoundException(
          "No se encontró el id de la Categoria de Mano de Obra en el Detalle Precio Hora Mano Obra"
        );
      return httpResponse.SuccessResponse(
        "El id de la Categoria de Mano de Obra en el Detalle Precio Hora Mano Obra fue encontrado con éxito",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria de Mano de Obra en el Detalle Precio Hora Mano Obra",
        error
      );
    }
  }
}

export const detailPriceHourWorkforceValidation =
  new DetailPriceHourWorkforceValidation();
