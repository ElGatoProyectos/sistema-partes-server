import { DetalleSemanaProyecto } from "@prisma/client";
import { DetailWeekProjectRepository } from "./detailWeekProject.repository";
import { I_CreateDetailWeekProject } from "./models/detailWeekProject.interface";
import prisma from "@/config/prisma.config";

class PrismaDetailWeekProjectRepository implements DetailWeekProjectRepository {
  async findAll(project_id: number): Promise<DetalleSemanaProyecto[] | null> {
    const details = await prisma.detalleSemanaProyecto.findMany({
      where: {
        proyecto_id: project_id,
      },
    });
    return details;
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
