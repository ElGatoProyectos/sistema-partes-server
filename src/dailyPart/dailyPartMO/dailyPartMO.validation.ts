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

  async findById(daily_part_mo_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartMO = await prismaDailyPartMORepository.findById(
        daily_part_mo_id
      );
      if (!dailyPartMO) {
        return httpResponse.NotFoundException(
          "El Parte Diario de la Mano de Obra no fue encontrado",
          dailyPartMO
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario de la Mano de Obra fue encontrado",
        dailyPartMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario de la Mano de Obra",
        error
      );
    }
  }
  async findAllForWorkforceIdAndDate(
    workforce_id: number,
    date: Date
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartsMO =
        await prismaDailyPartMORepository.findAllWithOutPaginationForIdMO(
          workforce_id,
          date
        );

      return httpResponse.SuccessResponse(
        "Los Partes Diarios de la Mano de Obra fue encontrado",
        dailyPartsMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios de la Mano de Obra",
        error
      );
    }
  }
  async findAllForIdsDailysParts(
    idsDailyParts: number[]
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartsMO =
        await prismaDailyPartMORepository.findAllWithOutPaginationForIdsDailysParts(
          idsDailyParts
        );

      return httpResponse.SuccessResponse(
        "Los Partes Diarios de la Mano de Obra por los ids de los Partes Diarios fue encontrado",
        dailyPartsMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios de la Mano de Obra por los ids de los Partes Diarios ",
        error
      );
    }
  }
}

export const dailyPartMOValidation = new DailyPartMOValidation();
