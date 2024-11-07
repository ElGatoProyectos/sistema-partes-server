import prisma from "../config/prisma.config";
import { SpecialtyWorkforceRepository } from "./specialtyWorkforce.repository";

import { E_Estado_BD, EspecialidadObrero } from "@prisma/client";
import {
  I_CreateSpecialtyWorkforceBD,
  I_SpecialtyWorkforce,
  I_UpdateSpecialtyBD,
} from "./models/specialtyWorkforce.interface";
import { T_FindAllSpecialty } from "./models/specialtyWorkforce.types";

class PrismaSpecialtyWorkforceRepository
  implements SpecialtyWorkforceRepository
{
  async findAll(
    skip: number,
    data: T_FindAllSpecialty,
    project_id: number
  ): Promise<{ specialities: I_SpecialtyWorkforce[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [specialities, total]: [I_SpecialtyWorkforce[], number] =
      await prisma.$transaction([
        prisma.especialidadObrero.findMany({
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
        prisma.especialidadObrero.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { specialities, total };
  }
  async updateSpecialtyWorkforce(
    speciality_id: number,
    data: I_UpdateSpecialtyBD
  ): Promise<EspecialidadObrero> {
    const specialityWorkforce = await prisma.especialidadObrero.update({
      where: {
        id: speciality_id,
      },
      data: data,
    });
    return specialityWorkforce;
  }
  async updateStatusSpecialtyWorkforce(
    origin_id: number
  ): Promise<EspecialidadObrero> {
    const specialityWorkforce = await prisma.especialidadObrero.update({
      where: {
        id: origin_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return specialityWorkforce;
  }
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
        nombre: {
          contains: name,
        },
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
