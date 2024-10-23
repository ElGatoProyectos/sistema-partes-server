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
}

export const weekValidation = new WeekValidation();
