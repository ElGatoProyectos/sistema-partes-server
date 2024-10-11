import prisma from "@/config/prisma.config";
import { OriginWorkforceRepository } from "./originWorkforce.repository";
import {
  I_CreateOriginWorkforceBD,
  I_OriginWorkforce,
} from "./models/originWorkforce.interface";
import { E_Estado_BD, OrigenObrero } from "@prisma/client";

class PrismaOriginWorkforceRepository implements OriginWorkforceRepository {
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

  async createOriginWorkforce(
    data: I_CreateOriginWorkforceBD
  ): Promise<OrigenObrero> {
    const originWorkforce = await prisma.origenObrero.create({
      data,
    });
    return originWorkforce;
  }
  async findAll(project_id: number): Promise<OrigenObrero[]> {
    const originsWorkforce = await prisma.origenObrero.findMany({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return originsWorkforce;
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
