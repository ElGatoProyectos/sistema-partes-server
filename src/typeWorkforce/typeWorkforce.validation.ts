import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaTypeWorkforceRepository } from "./prisma-typeWorkfoce.repository";

class TypeWorkforceValidation {
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const typeWorkforce = await prismaTypeWorkforceRepository.findById(
        bank_id
      );
      if (!typeWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró el Tipo de la Mano de Obra solicitada"
        );
      return httpResponse.SuccessResponse(
        "Tipo de la Mano de Obra encontrado con éxito",
        typeWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tipo de la Mano de Obra",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const typeWorkforce = await prismaTypeWorkforceRepository.findByName(
        name,
        project_id
      );
      if (!typeWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró el Tipo de la Mano de Obra con el nombre que desea buscar"
        );
      return httpResponse.SuccessResponse(
        "Tipo de la Mano de Obra encontrado con éxito",
        typeWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tipo de la Mano de Obra",
        error
      );
    }
  }
}

export const typeWorkforceValidation = new TypeWorkforceValidation();
