import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "./../common/http.response";
import { prismaWeekRepository } from "./prisma-week.repository";

class WeekService {
  async createWeek(year: number): Promise<T_HttpResponse> {
    try {
      let currentStartDate = new Date(year, 0, 1); // Año, mes (0 es enero), día (1)
      let weekNumber = 1;

      for (let i = 0; i < 104; i++) {
        let currentYear = currentStartDate.getFullYear();
        // Calcula el fin de la semana (6 días después del inicio)
        const currentEndDate = this.addDays(currentStartDate, 6);
        let month = (currentStartDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const result = await prismaWeekRepository.createUnit(
          String(currentYear) + "." + month,
          currentStartDate,
          currentEndDate
        );
        if (!result) {
          return httpResponse.InternalServerErrorException(
            `Error al crear la semana número ${weekNumber}`
          );
        }
        currentStartDate = this.addDays(currentStartDate, 7);
        weekNumber++;
      }
      return httpResponse.SuccessResponse("Éxito al crear todas las semanas");
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear las semanas",
        error
      );
    }
  }
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
  async findByYear(year: number): Promise<T_HttpResponse> {
    try {
      const weekResponse = await prismaWeekRepository.findByDate(year);
      if (!weekResponse) {
        return httpResponse.NotFoundException("El año no fue encontrado");
      }
      return httpResponse.SuccessResponse("Año encontrada", weekResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const weekService = new WeekService();
