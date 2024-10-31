import prisma from "@/config/prisma.config";
import { ResourcesRepository } from "./resources.repository";
import {
  I_CreateResourcesBD,
  I_Resources,
  I_UpdateResourcesBodyValidation,
} from "./models/resources.interface";
import { CategoriaRecurso, E_Estado_BD, Recurso } from "@prisma/client";
import { T_FindAllResource } from "./models/resource.types";
import { resourseCategoryValidation } from "@/resourseCategory/resourseCategory.validation";
import { contains } from "validator";

class PrismaResourcesRepository implements ResourcesRepository {
  async createResource(data: I_CreateResourcesBD): Promise<Recurso> {
    const resource = await prisma.recurso.create({
      data,
    });
    return resource;
  }
  async updateResource(
    data: I_UpdateResourcesBodyValidation,
    resource_id: number
  ): Promise<Recurso> {
    const resource = await prisma.recurso.update({
      where: { id: resource_id },
      data: data,
    });
    return resource;
  }
  async updateStatusResource(resource_id: number): Promise<Recurso | null> {
    const resource = await prisma.recurso.findFirst({
      where: {
        id: resource_id,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateTrain =
      resource?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const trainUpdate = await prisma.recurso.update({
      where: { id: resource_id },
      data: {
        eliminado: newStateTrain,
      },
    });
    return trainUpdate;
  }
  async findAll(
    skip: number,
    data: T_FindAllResource,
    project_id: number
  ): Promise<{ resources: I_Resources[]; total: number }> {
    let filtersResource: any = {};
    let filters: any = {};
    if (data.queryParams.search) {
      filtersResource.nombre = data.queryParams.search;
    }

    if (data.queryParams.category && data.queryParams.category !== "TODOS") {
      filters.nombre = data.queryParams.category;
    }

    const [resources, total]: [I_Resources[], number] =
      await prisma.$transaction([
        prisma.recurso.findMany({
          where: {
            nombre: {
              contains: filtersResource.nombre,
            },
            CategoriaRecurso: {
              nombre: {
                contains: filters.nombre,
              },
            },
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
          skip,
          take: data.queryParams.limit,
          include: {
            CategoriaRecurso: true,
            IndiceUnificado: true,
            Unidad: true,
          },
          omit: {
            eliminado: true,
          },
          orderBy: {
            codigo: "asc",
          },
        }),
        prisma.recurso.count({
          where: {
            nombre: {
              contains: filtersResource.nombre,
            },
            CategoriaRecurso: {
              nombre: {
                contains: filters.nombre,
              },
            },
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { resources, total };
  }

  async findById(resource_id: number): Promise<I_Resources | null> {
    const resource = await prisma.recurso.findFirst({
      where: {
        id: resource_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return resource;
  }

  async codeMoreHigh(project_id: number): Promise<Recurso | null> {
    const lastResource = await prisma.recurso.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastResource;
  }

  async findByCode(code: string, project_id: number): Promise<Recurso | null> {
    const resource = await prisma.recurso.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return resource;
  }

  async findByName(name: string, project_id: number): Promise<Recurso | null> {
    const resource = await prisma.recurso.findFirst({
      where: {
        nombre: {
          contains: name,
        },
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return resource;
  }
}

export const prismaResourcesRepository = new PrismaResourcesRepository();
