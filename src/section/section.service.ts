import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateSeccionBD } from "./models/section.repository";
import { prismaSectionRepository } from "./prismaSection.repository";

class SeccionService {
  async createSection(data: I_CreateSeccionBD): Promise<T_HttpResponse> {
    try {
      const responseSection = await prismaSectionRepository.createSection(data);
      return httpResponse.CreatedResponse(
        "Sección creada correctamente",
        responseSection
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Sección",
        error
      );
    }
  }
}
export const sectionService = new SeccionService();
