import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaSectionRepository } from "./prismaSection.repository";

class SectionValidation {
  async findById(section_id: number): Promise<T_HttpResponse> {
    try {
      const section = await prismaSectionRepository.findById(section_id);
      if (!section) {
        return httpResponse.NotFoundException("Id de la Sección no encontrado");
      }
      return httpResponse.SuccessResponse("Sección encontrada", section);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Sección",
        error
      );
    }
  }
}

export const sectionValidation = new SectionValidation();
