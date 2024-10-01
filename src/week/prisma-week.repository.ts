import prisma from "@/config/prisma.config";
import { WeekRepository } from "./week.repository";
import { Semana } from "@prisma/client";

class PrismaWeekRepository implements WeekRepository {
  async createUnit(
    weekNumber: number,
    currentStartDate: Date,
    currentEndDate: Date
  ): Promise<Semana | null> {
    const week = await prisma.semana.create({
      data: {
        codigo: String(weekNumber),
        fecha_inicio: currentStartDate,
        fecha_fin: currentEndDate,
      },
    });
    return week;
  }
}

export const prismaWeekRepository = new PrismaWeekRepository();
