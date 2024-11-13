import { ParteDiarioRecurso } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DailyPartResourceRepository } from "./dailyPartResources.repository";
import { I_UpdateDailyPartResourcesBD } from "./models/dailyPartResources.interface";
import { T_FindAllDailyPartResource } from "./models/dailyPartResource.types";

class PrismaDailyPartResourceRepository implements DailyPartResourceRepository {
  async delete(daily_part_resource_id: number) {
    await prisma.parteDiarioRecurso.delete({
      where: {
        id: daily_part_resource_id,
      },
    });
  }
  async findAll(
    skip: number,
    data: T_FindAllDailyPartResource,
    project_id: number,
    daily_part_id: number
  ): Promise<{ dailyPartsResources: any[]; total: number }> {
    let filters: any = {};
    let filtersResources: any = {};
    if (data.queryParams.search) {
      filtersResources.nombre = data.queryParams.search;
    }

    if (data.queryParams.category && data.queryParams.category !== "TODOS") {
      filters.nombre = data.queryParams.category;
    }
    const dailyPartsResources = await prisma.parteDiarioRecurso.findMany({
      where: {
        proyecto_id: project_id,
        parte_diario_id: daily_part_id,
        Recurso: {
          nombre: {
            contains: filtersResources.nombre,
          },
          CategoriaRecurso: {
            nombre: {
              contains: filters.nombre,
            },
          },
        },
      },
      include: {
        Recurso: {
          include: {
            Unidad: true,
            IndiceUnificado: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.parteDiarioRecurso.count({
      where: {
        proyecto_id: project_id,
        parte_diario_id: daily_part_id,
        Recurso: {
          nombre: {
            contains: filtersResources.nombre,
          },
          CategoriaRecurso: {
            nombre: {
              contains: filters.nombre,
            },
          },
        },
      },
    });

    const dailyParts = dailyPartsResources.map((item) => {
      const { Recurso, ...ResData } = item;
      const { Unidad, IndiceUnificado, ...datos } = Recurso;
      return {
        codigo: IndiceUnificado.codigo + ResData.id,
        nombre_del_recurso: Recurso.nombre,
        unidad: Unidad.simbolo,
        cantidad_utilizada: ResData.cantidad,
      };
    });

    return { dailyPartsResources: dailyParts, total };
  }
  async findById(
    daily_part_resource_id: number
  ): Promise<ParteDiarioRecurso | null> {
    const dailyPartResource = await prisma.parteDiarioRecurso.findFirst({
      where: {
        id: daily_part_resource_id,
      },
      include: {
        Recurso: {
          include: {
            Unidad: true,
            IndiceUnificado: true,
          },
        },
      },
    });
    return dailyPartResource;
  }
  async createDailyPartResources(
    ids: number[],
    project_id: number,
    daily_part_id: number
  ) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const data = ids.map((id) => ({
      parte_diario_id: daily_part_id,
      recurso_id: id,
      cantidad: 0,
      proyecto_id: project_id,
    }));

    await prisma.parteDiarioRecurso.createMany({
      data: data,
    });
  }
  async updateDailyPartResources(
    data: I_UpdateDailyPartResourcesBD,
    daily_part_resources_id: number
  ): Promise<ParteDiarioRecurso | null> {
    const updateDailyPartResource = await prisma.parteDiarioRecurso.update({
      where: {
        id: daily_part_resources_id,
      },
      data: data,
    });
    return updateDailyPartResource;
  }
}

export const prismaDailyPartResourceRepository =
  new PrismaDailyPartResourceRepository();
