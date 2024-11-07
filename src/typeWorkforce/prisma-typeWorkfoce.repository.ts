import prisma from "../config/prisma.config";
import {
  I_CreateTypeWorkforceBD,
  I_Type,
  I_TypeWorkforce,
  I_UpdateTypeBD,
} from "./models/typeWorkforce.interface";
import { TypeWorkforceRepository } from "./typeWorkforce.repository";
import { E_Estado_BD, TipoObrero } from "@prisma/client";
import { T_FindAllType } from "./models/typeWorkforce.types";

class PrismaTypeWorkforceRepository implements TypeWorkforceRepository {
  async updateTypeWorkforce(
    type_id: number,
    data: I_UpdateTypeBD
  ): Promise<TipoObrero> {
    const typeWorkforce = await prisma.tipoObrero.update({
      where: {
        id: type_id,
      },
      data: data,
    });
    return typeWorkforce;
  }
  async updateStatusTypeWorkforce(type_id: number): Promise<TipoObrero> {
    const typeWorkforce = await prisma.tipoObrero.update({
      where: {
        id: type_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return typeWorkforce;
  }
  async createTypeWorkforceMasive(
    data: I_CreateTypeWorkforceBD[]
  ): Promise<{ count: number }> {
    const typeWorkforce = await prisma.tipoObrero.createMany({
      data,
    });
    return typeWorkforce;
  }
  async findByName(
    name: string,
    project_id: number
  ): Promise<TipoObrero | null> {
    const typeWorkforce = await prisma.tipoObrero.findFirst({
      where: {
        nombre: {
          contains: name,
        },
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return typeWorkforce;
  }

  async createTypeWorkforce(
    data: I_CreateTypeWorkforceBD
  ): Promise<TipoObrero> {
    const typeWorkforce = await prisma.tipoObrero.create({
      data,
    });
    return typeWorkforce;
  }

  async findAll(
    skip: number,
    data: T_FindAllType,
    project_id: number
  ): Promise<{ types: I_Type[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [types, total]: [I_Type[], number] = await prisma.$transaction([
      prisma.tipoObrero.findMany({
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
      prisma.tipoObrero.count({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { types, total };
  }

  async findById(type_id: number): Promise<I_TypeWorkforce | null> {
    const typeWorkforce = await prisma.tipoObrero.findFirst({
      where: {
        id: type_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return typeWorkforce;
  }
}

export const prismaTypeWorkforceRepository =
  new PrismaTypeWorkforceRepository();
