import { E_Estado_BD, ManoObra } from "@prisma/client";
import { WorkforceRepository } from "./workforce.repository";
import prisma from "@/config/prisma.config";
import {
  I_CreateWorkforceBD,
  I_UpdateWorkforceBodyValidation,
  I_Workforce,
} from "./models/workforce.interface";
import { T_FindAllWorkforce } from "./models/workforce.types";

class PrismaWorkforceRepository implements WorkforceRepository {
  async findByCode(code: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByDNI(dni: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        documento_identidad: dni,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async existsName(name: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        nombre_completo: name,
        proyecto_id: project_id,
      },
    });
    return workforce;
  }

  async codeMoreHigh(project_id: number): Promise<ManoObra | null> {
    const lastWorkforce = await prisma.manoObra.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastWorkforce;
  }
  async createWorkforce(data: I_CreateWorkforceBD): Promise<ManoObra> {
    const workforce = await prisma.manoObra.create({
      data,
    });
    return workforce;
  }
  async updateWorkforce(
    data: I_UpdateWorkforceBodyValidation,
    workforce_id: number
  ): Promise<ManoObra> {
    const workforce = await prisma.manoObra.update({
      where: { id: workforce_id },
      data: data,
    });
    return workforce;
  }

  async findAll(
    skip: number,
    data: T_FindAllWorkforce,
    project_id: number
  ): Promise<{ workforces: I_Workforce[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.nombre_completo = {
          contains: data.queryParams.search,
        };
      } else {
        filters.codigo = {
          contains: data.queryParams.search,
        };
      }
    }
    const [workforces, total]: [I_Workforce[], number] =
      await prisma.$transaction([
        prisma.manoObra.findMany({
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
          orderBy: {
            codigo: "asc",
          },
        }),
        prisma.manoObra.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { workforces, total };
  }

  async findById(workforce_id: number): Promise<I_Workforce | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        id: workforce_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return workforce;
  }

  async updateStatusWorkforce(workforce_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        id: workforce_id,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateTrain =
      workforce?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const trainUpdate = await prisma.manoObra.update({
      where: { id: workforce_id },
      data: {
        eliminado: newStateTrain,
      },
    });
    return trainUpdate;
  }
}

export const prismaWorkforceRepository = new PrismaWorkforceRepository();