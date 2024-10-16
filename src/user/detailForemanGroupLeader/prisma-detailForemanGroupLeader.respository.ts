import { DetalleCapatazJefeGrupo } from "@prisma/client";
import { DetailForemanGroupLeaderRepository } from "./detailForemanGroupLeader.repository";
import { T_FindAllDetailForemanGroupLeader } from "./models/detailForemanGroupLeader.types";
import prisma from "@/config/prisma.config";
import { I_DetailForemanGroupLeader } from "./models/detailForemanGroupLeader.interfaces";

class PrismaDetailForemanGroupLeaderRepository
  implements DetailForemanGroupLeaderRepository
{
  async getAllDetailForemanGroupLeader(
    skip: number,
    data: T_FindAllDetailForemanGroupLeader,
    project_id: number
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let userAll: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }

    // ===============================================================

    // obtener usuario id del token

    const capataz_id = 1;

    const userAllReplace = await prisma.detalleCapatazJefeGrupo.findMany({
      where: {
        proyecto_id: project_id,
        usuario_capataz_id: capataz_id,
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

    const formatedData = userAllReplace.map((item) => {
      const { JefeGrupo } = item;
      const { Rol, ...ResData } = JefeGrupo;

      return { Rol, ...ResData };
    });

    // ===============================================================

    total = prisma.detalleCapatazJefeGrupo.count({});
    // [users, total] = await prisma.$transaction([
    //   prisma.detalleCapatazJefeGrupo.findMany({
    //     where: {
    //       proyecto_id: project_id,
    //     },
    //     include: {
    //       // CapatazJefe: {
    //       //   include: {
    //       //     Rol: true,
    //       //   },
    //       // },
    //       JefeGrupo: {
    //         include: {
    //           Rol: true,
    //         },
    //       },
    //     },
    //     skip,
    //     take: data.queryParams.limit,
    //   }),
    //   prisma.detalleCapatazJefeGrupo.count({}),
    // ]);
    // const userAll = users.map((item: I_DetailForemanGroupLeader) => {
    //   let user;
    //   if (item.CapatazJefe.Rol?.rol === "CAPATAZ") {
    //     console.log("entro al capataz");
    //     user = item.CapatazJefe;
    //   }
    //   if (item.JefeGrupo.Rol?.rol === "CAPATAZ") {
    //     console.log("entro al jefe de grupo");
    //     user = item.JefeGrupo;
    //   }
    //   return {
    //     usuario: user,
    //     rol: Rol,
    //   };
    // });
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
