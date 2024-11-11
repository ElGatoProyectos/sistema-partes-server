import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaAssistsRepository } from "./prisma-assists.repository";

class AssistsWorkforceValidation {
  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findById(id);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia con ese id"
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
  async findByDate(date: Date): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByDate(date);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha"
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
  async findAllPresents(project_id: number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findAllPresents(project_id);
      return httpResponse.SuccessResponse(
        "La Asistencia de los presentes fue encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia de los presentes",
        error
      );
    }
  }
  async findByDateAndMO(mano_obra_id: number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByIdMoAndDate(
        mano_obra_id
      );
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha y mano de obra"
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
