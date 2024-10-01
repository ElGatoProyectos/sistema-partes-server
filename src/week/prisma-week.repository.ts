import prisma from "@/config/prisma.config";
import { WeekRepository } from "./week.repository";
import { Semana } from "@prisma/client";

class PrismaWeekRepository implements WeekRepository {
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
  async createUnit(
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
