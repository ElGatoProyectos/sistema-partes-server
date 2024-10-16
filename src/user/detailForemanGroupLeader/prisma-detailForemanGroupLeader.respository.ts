import { DetalleCapatazJefeGrupo } from "@prisma/client";
import { DetailForemanGroupLeaderRepository } from "./detailForemanGroupLeader.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

class PrismaDetailForemanGroupLeaderRepository
  implements DetailForemanGroupLeaderRepository
{
  async getAllDetailForemanGroupLeader(
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

    const userAllReplace = await prisma.detalleCapatazJefeGrupo.findMany({
      where: {
        usuario_capataz_id: user_id,
        proyecto_id: project_id,
        JefeGrupo: {
          ...filters,
        },
      },
      include: {
        JefeGrupo: {
          include: {
            Rol: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });

    const userAll = userAllReplace.map((item) => {
      const { JefeGrupo } = item;
      const { Rol, ...ResData } = JefeGrupo;
      return {
        rol: Rol,
        usuario: ResData,
      };
    });

    total = await prisma.detalleCapatazJefeGrupo.count({
      where: {
        usuario_capataz_id: user_id,
        proyecto_id: project_id,
        JefeGrupo: {
          ...filters,
        },
      },
    });

    return { userAll, total };
  }
  async createDetailForemanGroupLeader(
    user_id: number,
    user2_id: number,
    proyect_id: number
  ): Promise<DetalleCapatazJefeGrupo> {
    const detailForemanGroupLeader =
      await prisma.detalleCapatazJefeGrupo.create({
        data: {
          usuario_capataz_id: user_id,
          usuario_jefe_grupo_id: user2_id,
          proyecto_id: proyect_id,
        },
      });
    return detailForemanGroupLeader;
  }
  async verifyIdDetailForemanGroupLeader(
    user_id: number
  ): Promise<DetalleCapatazJefeGrupo | null> {
    const detail = await prisma.detalleCapatazJefeGrupo.findFirst({
      where: {
        OR: [
          { usuario_capataz_id: user_id },
          { usuario_jefe_grupo_id: user_id },
        ],
      },
    });
    return detail;
  }
}

export const prismaDetailForemanGroupLeaderRepository =
  new PrismaDetailForemanGroupLeaderRepository();
