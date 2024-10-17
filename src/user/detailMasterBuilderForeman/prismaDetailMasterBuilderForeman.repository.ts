import prisma from "@/config/prisma.config";
import { DetalleMaestroObraCapataz } from "@prisma/client";
import { DetailMasterBuilderForemanRepository } from "./detailMasterBuilderForeman.repository";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

class PrismaDetailMasterBuilderForemanRepository
  implements DetailMasterBuilderForemanRepository
{
  async deleteDetail(
    detail_id: number
  ): Promise<DetalleMaestroObraCapataz | null> {
    const detail = await prisma.detalleMaestroObraCapataz.delete({
      where: {
        id: detail_id,
      },
    });
    return detail;
  }
  async findByIdForeman(
    foreman_id: number,
    project_id: number
  ): Promise<DetalleMaestroObraCapataz | null> {
    const detail = await prisma.detalleMaestroObraCapataz.findFirst({
      where: {
        usuario_capataz_id: foreman_id,
        proyecto_id: project_id,
      },
    });
    return detail;
  }

  async getAllDetailMasterBuilderForeman(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }

    const userAllReplace = await prisma.detalleMaestroObraCapataz.findMany({
      where: {
        usuario_mo_id: user_id,
        proyecto_id: project_id,
        Capataz: {
          ...filters,
        },
      },
      include: {
        Capataz: {
          include: {
            Rol: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });

    const userAll = userAllReplace.map((item) => {
      const { Capataz } = item;
      const { Rol, ...ResData } = Capataz;
      return {
        rol: Rol,
        usuario: ResData,
      };
    });

    total = await prisma.detalleMaestroObraCapataz.count({
      where: {
        usuario_mo_id: user_id,
        proyecto_id: project_id,
        Capataz: {
          ...filters,
        },
      },
    });

    return { userAll, total };
  }
  async createDetailMasterBuilderForeman(
    user_id: number,
    user2_id: number,
    project_id: number
  ): Promise<DetalleMaestroObraCapataz> {
    const detailWorkforceForeman =
      await prisma.detalleMaestroObraCapataz.create({
        data: {
          usuario_mo_id: user_id,
          usuario_capataz_id: user2_id,
          proyecto_id: project_id,
        },
      });
    return detailWorkforceForeman;
  }
  async verifyIdDetailMasterBuilderForeman(
    user_id: number
  ): Promise<DetalleMaestroObraCapataz | null> {
    const detail = await prisma.detalleMaestroObraCapataz.findFirst({
      where: {
        OR: [{ usuario_capataz_id: user_id }, { usuario_mo_id: user_id }],
      },
    });
    return detail;
  }
}

export const prismaDetailMasterBuilderForemanRepository =
  new PrismaDetailMasterBuilderForemanRepository();
