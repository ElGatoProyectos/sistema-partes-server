import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaActionRepository } from "./prismaAction.repository";

class ActionValidation {
  async findById(action_id: number): Promise<T_HttpResponse> {
    try {
      const action = await prismaActionRepository.findById(action_id);
      if (!action) {
        return httpResponse.NotFoundException("Id de la Acción no encontrado");
      }
      return httpResponse.SuccessResponse("Acción encontrada", action);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Acción",
        error
      );
    }
  }
}

export const actionValidation = new ActionValidation();
