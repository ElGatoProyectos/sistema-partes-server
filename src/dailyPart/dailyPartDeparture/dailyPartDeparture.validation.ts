import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { prismaDailyPartDepartureRepository } from "./prisma-dailyPartDeparture.repository";

class DailyPartDepartureValidation {
  async findByIdValidation(
    daily_part_departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartDepartureRepository.findById(
        daily_part_departure_id
      );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Detalle Parte Diario Partida no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario Partida fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario Partida",
        error
      );
    }
  }
  async findByIdDailyPartAndDeparture(
    daily_part_id: number,
    departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPart =
        await prismaDailyPartDepartureRepository.findByIdDailyPartAndDeparture(
          daily_part_id,
          departure_id
        );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Detalle Parte Diario Partida por el Parte Diario y la Partida no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario Partida por el Parte Diario y la Partida fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario Partida por el Parte Diario y la Partida",
        error
      );
    }
  }
  async findAllForDailyPart(daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart =
        await prismaDailyPartDepartureRepository.findAllForDailyPart(
          daily_part_id
        );

      return httpResponse.SuccessResponse(
        "Los Partes Diarios Partida por el Parte Diario fueron encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios Partida por el Parte Diario ",
        error
      );
    }
  }
  async findAllForIdsDailyPart(
    idsDailyPart: number[]
  ): Promise<T_HttpResponse> {
    try {
      const dailyParts =
        await prismaDailyPartDepartureRepository.findAllWithOutPaginationForidsDailyPart(
          idsDailyPart
        );

      return httpResponse.SuccessResponse(
        "Los Partes Diarios Partida por los ids de los ids de los Partes Diarios fueron encontrado",
        dailyParts
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Partes Diarios Partida por los ids de los Partes Diarios",
        error
      );
    }
  }
}

export const dailyPartDepartureValidation = new DailyPartDepartureValidation();
