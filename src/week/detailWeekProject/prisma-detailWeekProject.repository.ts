import { DetalleSemanaProyecto } from "@prisma/client";
import { DetailWeekProjectRepository } from "./detailWeekProject.repository";
import { I_CreateDetailWeekProject } from "./models/detailWeekProject.interface";
import prisma from "@/config/prisma.config";

class PrismaDetailWeekProjectRepository implements DetailWeekProjectRepository {
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
