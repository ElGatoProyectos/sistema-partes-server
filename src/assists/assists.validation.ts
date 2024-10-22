import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaAssistsRepository } from "./prisma-assists.repository";

class AssistsWorkforceValidation {
  async findByDate(date: Date): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByDate(date);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró hecho alguna asistencia para esa fecha"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
}

export const assistsWorkforceValidation = new AssistsWorkforceValidation();
