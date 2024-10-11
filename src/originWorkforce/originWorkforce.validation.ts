import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaOriginWorkforceRepository } from "./prisma-originWorkforce.repository";

class OriginWorkforceValidation {
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const originWorkforce = await prismaOriginWorkforceRepository.findById(
        bank_id
      );
      if (!originWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró el Origen de la Mano de Obra solicitado"
        );
      return httpResponse.SuccessResponse(
        "Origen de la Mano de Obra encontrado con éxito",
        originWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Origen de la Mano de Obra",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const originWorkforce = await prismaOriginWorkforceRepository.findByName(
        name,
        project_id
      );
      if (!originWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró el Origen de la Mano de Obra con el nombre que desea buscar"
        );
      return httpResponse.SuccessResponse(
        "Origen de la Mano de Obra encontrado con éxito",
        originWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Origen de la Mano de Obra",
        error
      );
    }
  }
}

export const originWorkforceValidation = new OriginWorkforceValidation();
