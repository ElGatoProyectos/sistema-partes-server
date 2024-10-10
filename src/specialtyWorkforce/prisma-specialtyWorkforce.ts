import prisma from "@/config/prisma.config";
import { SpecialtyWorkforceRepository } from "./specialtyWorkforce.repository";
import {
  I_CreateSpecialtyWorkforceBD,
  I_SpecialtyWorkforce,
} from "./models/specialtyWorkforce.interface";
import { E_Estado_BD, EspecialidadObrero } from "@prisma/client";

class PrismaSpecialtyWorkforceRepository
  implements SpecialtyWorkforceRepository
{
  async createSpecialtyWorkforceMasive(
    data: I_CreateSpecialtyWorkforceBD[]
  ): Promise<{ count: number }> {
    const specialtyWorkforce = await prisma.especialidadObrero.createMany({
      data,
    });
    return specialtyWorkforce;
  }
  async findByName(
    name: string,
    project_id: number
  ): Promise<EspecialidadObrero | null> {
    const specialtyWorkforce = await prisma.especialidadObrero.findFirst({
      where: {
        nombre: name,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return specialtyWorkforce;
  }

  async createSpecialtyWorkforce(
    data: I_CreateSpecialtyWorkforceBD
  ): Promise<EspecialidadObrero> {
    const specialtyWorkforce = await prisma.especialidadObrero.create({
      data,
    });
    return specialtyWorkforce;
  }
  async findAll(project_id: number): Promise<EspecialidadObrero[]> {
    const specialtyWorkforce = await prisma.especialidadObrero.findMany({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return specialtyWorkforce;
  }
  async findById(origin_id: number): Promise<I_SpecialtyWorkforce | null> {
    const specialtyWorkforce = await prisma.especialidadObrero.findFirst({
      where: {
        id: origin_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return specialtyWorkforce;
  }
}

export const prismaSpecialtyWorkforceRepository =
  new PrismaSpecialtyWorkforceRepository();
