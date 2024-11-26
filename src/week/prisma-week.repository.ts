import prisma from "../config/prisma.config";
import { WeekRepository } from "./week.repository";
import { Semana } from "@prisma/client";

class PrismaWeekRepository implements WeekRepository {
  
  async findAllForYear(year: number): Promise<Semana[] | null> {
    //[note] no se ocupe esto comentado ya que sino me trae las primera semana del proximo año ya q son los últimos días del año
    // const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    // const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
    const week = await prisma.semana.findMany({
      where: {
        codigo: {
          contains: String(year),
        },
      },
    });
    return week;
  }
  async findByCode(code: string): Promise<Semana | null> {
    const week = await prisma.semana.findFirst({
      where: {
        codigo: code,
      },
    });
    return week;
  }
  async findForDate(date: Date): Promise<Semana | null> {
    const week = await prisma.semana.findFirst({
      where: {
        fecha_inicio: {
          lte: date, // Menor o igual a la fecha de búsqueda
        },
        fecha_fin: {
          gte: date, // Mayor o igual a la fecha de búsqueda
        },
      },
    });
    return week;
  }
  async findLastWeek(): Promise<Semana | null> {
    const week = await prisma.semana.findFirst({
      orderBy: {
        id: "desc", // Ordena por ID de forma descendente
      },
    });
    return week;
  }
  async findByDate(year: number): Promise<Semana | null> {
    const week = await prisma.semana.findFirst({
      where: {
        fecha_inicio: {
          gte: new Date(year, 0, 1),
        },
      },
    });
    return week;
  }
  async createWeek(
    weekNumber: string,
    currentStartDate: Date,
    currentEndDate: Date
  ): Promise<Semana | null> {
    const week = await prisma.semana.create({
      data: {
        codigo: weekNumber,
        fecha_inicio: currentStartDate,
        fecha_fin: currentEndDate,
      },
    });
    return week;
  }
}

export const prismaWeekRepository = new PrismaWeekRepository();
