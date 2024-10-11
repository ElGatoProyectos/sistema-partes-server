import prisma from "@/config/prisma.config";
import {
  I_CreateTypeWorkforceBD,
  I_TypeWorkforce,
} from "./models/typeWorkforce.interface";
import { TypeWorkforceRepository } from "./typeWorkforce.repository";
import { E_Estado_BD, TipoObrero } from "@prisma/client";

class PrismaTypeWorkforceRepository implements TypeWorkforceRepository {
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
  async findAll(project_id: number): Promise<TipoObrero[]> {
    const typesWorkforce = await prisma.origenObrero.findMany({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return typesWorkforce;
  }
  async findById(type_id: number): Promise<I_TypeWorkforce | null> {
    const typeWorkforce = await prisma.origenObrero.findFirst({
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
