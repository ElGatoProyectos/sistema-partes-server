import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "./../common/http.response";
import { prismaWeekRepository } from "./prisma-week.repository";

class WeekService {
  async createWeek(year: number): Promise<T_HttpResponse> {
    const nextYear = year + 1;
    const weekResponse = await weekService.findByYear(year);
    if (!weekResponse.success) {
      // console.log("entro a crear hoy y mañana");
      this.createWeekThisYearAndNext(year);
      return httpResponse.SuccessResponse(
        "Semanas creadas para este y el siguiente año."
      );
    }
    const nextYearResponse = await weekService.findByYear(nextYear);
    if (!nextYearResponse.success) {
      // console.log("entro a crear mañana");
      const lastWeek = await prismaWeekRepository.findLastWeek();
      if (!lastWeek) {
        return httpResponse.BadRequestException("no hay nada");
      }
      this.createWeekOfYear(lastWeek.fecha_fin);
      return httpResponse.SuccessResponse(
        "Semanas creadas para el siguiente año."
      );
    }
    // console.log("hay para ambos");
    return httpResponse.SuccessResponse(
      "Las semanas ya existen para ambos años."
    );
  }
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    return newDate;
  }
  async createWeekThisYearAndNext(year: number) {
    try {
      let currentStartDate = new Date(year, 0, 1, 0, 0, 0); // Año, mes (0 es enero), día (1)
      let weekNumber = 1;
      let week;
      for (let i = 0; i < 104; i++) {
        let currentYear = currentStartDate.getFullYear();
        // Calcula el fin de la semana (6 días después del inicio)
        const currentEndDate = this.addDays(currentStartDate, 6);
        if (weekNumber > 52) {
          weekNumber = 1;
          currentYear++;
        }
        week = weekNumber.toString().padStart(2, "0");
        const result = await prismaWeekRepository.createWeek(
          String(currentYear) + "." + week,
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
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear las semanas",
        error
      );
    }
  }
  async createWeekOfYear(fecha_fin: Date) {
    try {
      let currentStartDate = this.addDays(fecha_fin, 1); // Año, mes (0 es enero), día (1)
      let weekNumber = 1;
      let week;
      let currentYear = currentStartDate.getFullYear() + 1;
      for (let i = 0; i < 52; i++) {
        // Calcula el fin de la semana (6 días después del inicio)
        const currentEndDate = this.addDays(currentStartDate, 6);
        week = weekNumber.toString().padStart(2, "0");
        const result = await prismaWeekRepository.createWeek(
          String(currentYear) + "." + week,
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
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear las semanas",
        error
      );
    }
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
        "Error al buscar el Año",
        error
      );
    } finally {
      await prisma.$disconnect();
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
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const weekService = new WeekService();
