import { DetalleSemanaProyecto } from "@prisma/client";
import { DetailWeekProjectRepository } from "./detailWeekProject.repository";
import {
  I_CreateDetailWeekProject,
  I_UpdateDetailWeekProject,
} from "./models/detailWeekProject.interface";
import prisma from "../../config/prisma.config";

class PrismaDetailWeekProjectRepository implements DetailWeekProjectRepository {
  async findByDateAndProject(date: Date, project_id: number): Promise<DetalleSemanaProyecto | null> {
    const dateNew= date;
    dateNew.setUTCHours(0,0,0,0);
    const detail= await prisma.detalleSemanaProyecto.findFirst({
      where:{
       proyecto_id:project_id,
       Semana:{
        fecha_inicio: {
          lte: dateNew, 
        },
        fecha_fin: {
          gte: dateNew,
        },
       }
      }
    })
    return detail;
  }
  async findAllForYear(date: Date): Promise<DetalleSemanaProyecto[] | null> {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    startOfYear.setUTCHours(0, 0, 0, 0);
    const endOfYear = new Date(year, 11, 31);
    endOfYear.setUTCHours(0, 0, 0, 0);
    const details = await prisma.detalleSemanaProyecto.findMany({
      where: {
        Semana: {
          AND: [
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
  async updateDetailMany(data: I_UpdateDetailWeekProject[], week_id: number) {
    await Promise.all(
      data.map(async (detail) => {
        if (detail.semana_id === week_id) {
          await prisma.detalleSemanaProyecto.updateMany({
            where: {
              semana_id: detail.semana_id,
            },
            data: {
              cierre: true,
            },
          });
        }
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
