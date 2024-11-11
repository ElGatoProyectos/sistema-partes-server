import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDailyPartMORepository } from "./prisma-dailyPartMO.repository";

class DailyPartMOValidation {
  async createMany(
    ids: number[],
    project_id: number,
    daily_part_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartsMO = await prismaDailyPartMORepository.createDailyPartMO(
        ids,
        project_id,
        daily_part_id
      );
      return httpResponse.SuccessResponse(
        "Los Partes Diarios de la Mano de Obra fueron encontrado",
        dailyPartsMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios de la Mano de Obra",
        error
      );
    }
  }
  async findAllWithOutPagination(project_id: number, daily_part_id: number) {
    try {
      const assists =
        await prismaDailyPartMORepository.findAllWithOutPagination(
          project_id,
          daily_part_id
        );

      return httpResponse.SuccessResponse(
        "Se trajo con éxito todos los Partes Diarios de Mano de Obra con el id proporcionado",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios Mano Obra con el id proporcionado del Parte Diario",
        error
      );
    }
  }
}

export const dailyPartMOValidation = new DailyPartMOValidation();
