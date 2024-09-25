import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateAccionBD } from "./models/action.repository";
import { prismaActionRepository } from "./prismaAction.repository";

class ActionService {
  async createAction(data: I_CreateAccionBD): Promise<T_HttpResponse> {
    try {
      const responseAction = await prismaActionRepository.createAction(data);
      return httpResponse.CreatedResponse(
        "Acción creada correctamente",
        responseAction
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la acción",
        error
      );
    }
  }
}
export const actionService = new ActionService();
