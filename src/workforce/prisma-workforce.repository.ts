import { E_Estado_BD, E_Estado_MO_BD, ManoObra } from "@prisma/client";
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
    let filtersCategory: any = {};
    let filtersOrigin: any = {};

    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.OR = [
          {
            nombre_completo: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_materno: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_paterno: {
              contains: data.queryParams.search,
            },
          },
        ];
      } else {
        filters.documento_identidad = {
          contains: data.queryParams.search,
        };
      }
    }

    if (data.queryParams.state) {
      if (data.queryParams.state.toUpperCase() == E_Estado_MO_BD.ACTIVO) {
        filters.estado = E_Estado_MO_BD.ACTIVO;
      }
      if (data.queryParams.state.toUpperCase() == E_Estado_MO_BD.INACTIVO) {
        filters.estado = E_Estado_MO_BD.INACTIVO;
      }
    }
    if (data.queryParams.category) {
      filtersCategory.nombre = {
        contains: data.queryParams.category,
      };
    }
    if (data.queryParams.origin) {
      filtersOrigin.nombre = {
        contains: data.queryParams.origin,
      };
    }
    const [workforces, total]: [I_Workforce[], number] =
      await prisma.$transaction([
        prisma.manoObra.findMany({
          where: {
            ...filters,
            CategoriaObrero: {
              ...filtersCategory,
            },
            TipoObrero: {
              ...filtersOrigin,
            },
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
            CategoriaObrero: {
              ...filtersCategory,
            },
            TipoObrero: {
              ...filtersOrigin,
            },
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
