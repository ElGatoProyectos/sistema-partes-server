import { DetalleSemanaProyecto } from "@prisma/client";
import { DetailWeekProjectRepository } from "./detailWeekProject.repository";
import { I_CreateDetailWeekProject } from "./models/detailWeekProject.interface";
import prisma from "@/config/prisma.config";

class PrismaDetailWeekProjectRepository implements DetailWeekProjectRepository {
  async findAllForYear(date: Date): Promise<DetalleSemanaProyecto[] | null> {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1,0,0,0); 
    const endOfYear = new Date(year, 11, 31, 23, 59, 59); 
    const details = await prisma.detalleSemanaProyecto.findMany({
      where: {
        Semana: {
          OR: [
            {
              fecha_inicio: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
            {
              fecha_fin: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
          ],
        },
      },
    });
    return details;
  }
  async updateDetailMany(data: I_CreateDetailWeekProject[]) {
    await Promise.all(
      data.map(async (detail) => {
        await prisma.detalleSemanaProyecto.updateMany({
          where: {
            semana_id: detail.semana_id,
          },
          data: {
            cierre: true,
          },
        });
      })
    );
  }
  async findIdWeek(week_id: number): Promise<DetalleSemanaProyecto | null> {
    const detail = await prisma.detalleSemanaProyecto.findFirst({
      where: {
        semana_id: week_id,
      },
    });
    return detail;
  }
  async findAll(
    project_id: number
  ): Promise<{ detailsNewFormat: any[] } | null> {
    const details = await prisma.detalleSemanaProyecto.findMany({
      where: {
        proyecto_id: project_id,
      },
      include: {
        Semana: true,
        Empresa: true,
        Proyecto: true,
      },
    });

    let detailsNewFormat = details.map((detail) => {
      const { Semana, ...data } = detail;
      return {
        semana: Semana.codigo,
        cierre: data.cierre,
      };
    });

    return { detailsNewFormat };
  }
  async createDetail(
    data: I_CreateDetailWeekProject
  ): Promise<DetalleSemanaProyecto> {
    const detail = await prisma.detalleSemanaProyecto.create({
      data: data,
    });
    return detail;
  }
  async findByIdProject(
    project_id: number
  ): Promise<DetalleSemanaProyecto | null> {
    const detail = await prisma.detalleSemanaProyecto.findFirst({
      where: {
        proyecto_id: project_id,
      },
    });
    return detail;
  }
}
export const prismaDetailWeekProjectRepository =
  new PrismaDetailWeekProjectRepository();
