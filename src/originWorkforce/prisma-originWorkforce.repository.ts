import prisma from "@/config/prisma.config";
import { OriginWorkforceRepository } from "./originWorkforce.repository";
import {
  I_CreateOriginWorkforceBD,
  I_Origin,
  I_OriginWorkforce,
  I_UpdateOriginBD,
} from "./models/originWorkforce.interface";
import { E_Estado_BD, OrigenObrero } from "@prisma/client";
import { T_FindAllOrigin } from "./models/originWorkforce.types";

class PrismaOriginWorkforceRepository implements OriginWorkforceRepository {
  async createOriginWorkforce(
    data: I_CreateOriginWorkforceBD
  ): Promise<OrigenObrero> {
    const originWorkforce = await prisma.origenObrero.create({
      data,
    });
    return originWorkforce;
  }
  async updateOriginWorkforce(
    origin_id: number,
    data: I_UpdateOriginBD
  ): Promise<OrigenObrero> {
    const originWorkforce = await prisma.origenObrero.update({
      where: {
        id: origin_id,
      },
      data: data,
    });
    return originWorkforce;
  }
  async updateStatusOriginWorkforce(origin_id: number): Promise<OrigenObrero> {
    const originWorkforce = await prisma.origenObrero.update({
      where: {
        id: origin_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return originWorkforce;
  }

  async createOriginWorkforceMasive(
    data: I_CreateOriginWorkforceBD[]
  ): Promise<{ count: number }> {
    const originWorkforce = await prisma.origenObrero.createMany({
      data,
    });
    return originWorkforce;
  }
  async findByName(
    name: string,
    project_id: number
  ): Promise<OrigenObrero | null> {
    const originWorkforce = await prisma.origenObrero.findFirst({
      where: {
        nombre: {
          contains: name,
        },
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return originWorkforce;
  }

  async findAll(
    skip: number,
    data: T_FindAllOrigin,
    project_id: number
  ): Promise<{ origins: I_Origin[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [origins, total]: [I_Origin[], number] = await prisma.$transaction([
      prisma.origenObrero.findMany({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: data.queryParams.limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.origenObrero.count({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { origins, total };
  }
  async findById(origin_id: number): Promise<I_OriginWorkforce | null> {
    const originWorkforce = await prisma.origenObrero.findFirst({
      where: {
        id: origin_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return originWorkforce;
  }
}

export const prismaOriginWorkforceRepository =
  new PrismaOriginWorkforceRepository();
