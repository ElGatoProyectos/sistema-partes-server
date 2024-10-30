import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaWeekRepository } from "./prisma-week.repository";

class WeekValidation {
  async findByCode(code: string): Promise<T_HttpResponse> {
    try {
      const week = await prismaWeekRepository.findByCode(code);
      if (!week) {
        return httpResponse.NotFoundException(
          "El código de la Semana fue no fue encontrado",
          week
        );
      }
      return httpResponse.SuccessResponse(
        "El código de la Semana fue encontrado",
        week
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el código de la Semana",
        error
      );
    }
  }
  async findByDate(date: Date): Promise<T_HttpResponse> {
    try {
      const weekResponse = await prismaWeekRepository.findForDate(date);
      if (!weekResponse) {
        return httpResponse.NotFoundException(
          "No se encontró una semana para la fecha que está pasando"
        );
      }
      return httpResponse.SuccessResponse(
        "Se encontró la semana",
        weekResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Semana",
        error
      );
    }
  }
  async findAllForYear(year: number): Promise<T_HttpResponse> {
    try {
      const weekResponse = await prismaWeekRepository.findAllForYear(year);

      return httpResponse.SuccessResponse(
        "Se encontraron todas las semanas",
        weekResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar todas las Semana",
        error
      );
    }
  }
}

export const weekValidation = new WeekValidation();
