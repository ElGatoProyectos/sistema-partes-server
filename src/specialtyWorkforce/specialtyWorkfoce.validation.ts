import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaSpecialtyWorkforceRepository } from "./prisma-specialtyWorkforce";

class SpecialtyWorkforceValidation {
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const specialtyWorkforce =
        await prismaSpecialtyWorkforceRepository.findById(bank_id);
      if (!specialtyWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró la Especialidad de la Mano de Obra solicitada"
        );
      return httpResponse.SuccessResponse(
        "Especialidad de la Mano de Obra encontrado con éxito",
        specialtyWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Especialidad",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const specialtyWorkforce =
        await prismaSpecialtyWorkforceRepository.findByName(name, project_id);
      if (!specialtyWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró la Especialidad de la Mano de Obra con el nombre que desea buscar"
        );
      return httpResponse.SuccessResponse(
        "Especialidad de la Mano de Obra encontrado con éxito",
        specialtyWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Especialidad de la Mano de Obra",
        error
      );
    }
  }
}

export const specialtyWorkforceValidation = new SpecialtyWorkforceValidation();
