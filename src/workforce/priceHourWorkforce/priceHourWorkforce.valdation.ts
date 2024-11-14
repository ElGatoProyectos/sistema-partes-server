import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaPriceHourWorkforceRepository } from "./prisma-priceHourWorkforce.repository";

class PriceHourWorkforceValidation {
  async findByDate(date: Date): Promise<T_HttpResponse> {
    try {
      const detail = await prismaPriceHourWorkforceRepository.findByDate(date);
      if (!detail)
        return httpResponse.NotFoundException(
          "No se encontró según la fecha el Detalle Precio Hora Mano Obra"
        );
      return httpResponse.SuccessResponse(
        "Según la fecha el Detalle Precio Hora Mano Obra fue encontrado con éxito",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar según la fecha el Detalle Precio Hora Mano Obra",
        error
      );
    }
  }
}

export const priceHourWorkforceValidation = new PriceHourWorkforceValidation();
