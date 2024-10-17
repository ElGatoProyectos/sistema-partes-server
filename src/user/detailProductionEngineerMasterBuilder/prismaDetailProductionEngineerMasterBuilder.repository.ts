import { DetalleIngenieroProduccionMaestroObra } from "@prisma/client";
import { DetailProductionEngineerMasterBuilder } from "./detailProductionEngineerMasterBuilder.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

class PrismaDetailProductionEngineerMasterBuilderRepository
  implements DetailProductionEngineerMasterBuilder
{
  async deleteDetail(
    detail_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra> {
    const detail = await prisma.detalleIngenieroProduccionMaestroObra.delete({
      where: {
        id: detail_id,
      },
    });
    return detail;
  }
  async findByIdMasterBuilder(
    masterBuilder_id: number,
    project_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra | null> {
    const detail = await prisma.detalleIngenieroProduccionMaestroObra.findFirst(
      {
        where: {
          usuario_produccion_id: masterBuilder_id,
          proyecto_id: project_id,
        },
      }
    );
    return detail;
  }
  async getAllDetailProductionEngineerMasterBuilder(
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

    const userAllReplace =
      await prisma.detalleIngenieroProduccionMaestroObra.findMany({
        where: {
          usuario_ingeniero_id: user_id,
          proyecto_id: project_id,
          Produccion: {
            ...filters,
          },
        },
        include: {
          Produccion: {
            include: {
              Rol: true,
            },
          },
        },
        skip,
        take: data.queryParams.limit,
      });

    const userAll = userAllReplace.map((item) => {
      const { Produccion } = item;
      const { Rol, ...ResData } = Produccion;
      return {
        rol: Rol,
        usuario: ResData,
      };
    });

    total = await prisma.detalleIngenieroProduccionMaestroObra.count({
      where: {
        usuario_ingeniero_id: user_id,
        proyecto_id: project_id,
        Produccion: {
          ...filters,
        },
      },
    });

    return { userAll, total };
  }

  async createDetailProductionEngineerMasterBuilder(
    user_id: number,
    user2_id: number,
    proeject_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra> {
    const detailProuductionEngineerWorkforce =
      await prisma.detalleIngenieroProduccionMaestroObra.create({
        data: {
          usuario_ingeniero_id: user_id,
          usuario_produccion_id: user2_id,
          proyecto_id: proeject_id,
        },
      });
    return detailProuductionEngineerWorkforce;
  }
  async verifyIdDetailProductionEngineerMasterBuilder(
    user_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra | null> {
    const detail = await prisma.detalleIngenieroProduccionMaestroObra.findFirst(
      {
        where: {
          OR: [
            { usuario_ingeniero_id: user_id },
            { usuario_produccion_id: user_id },
          ],
        },
      }
    );
    return detail;
  }
}

export const prismaDetailProductionEngineerMasterBuilderRepository =
  new PrismaDetailProductionEngineerMasterBuilderRepository();
