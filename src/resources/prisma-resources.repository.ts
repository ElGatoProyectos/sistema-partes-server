import prisma from "@/config/prisma.config";
import { ResourcesRepository } from "./resources.repository";
import {
  I_CreateResourcesBD,
  I_Resources,
  I_ResourcesExcel,
  I_UpdateResourcesBodyValidation,
} from "./models/resources.interface";
import { E_Estado_BD, Recurso } from "@prisma/client";
import { T_FindAllResource } from "./models/resource.types";

class PrismaResourcesRepository implements ResourcesRepository {
  async findAll(
    skip: number,
    data: T_FindAllResource,
    project_id: number
  ): Promise<{ resources: I_Resources[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.nombre = {
          contains: data.queryParams.search,
        };
      } else {
        filters.codigo = {
          contains: data.queryParams.search,
        };
      }
    }
    const [resources, total]: [I_Resources[], number] =
      await prisma.$transaction([
        prisma.recurso.findMany({
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
        prisma.recurso.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { resources, total };
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
        // eliminado: E_Estado_BD.n,
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

  async createResource(data: I_CreateResourcesBD): Promise<Recurso> {
    const resource = await prisma.recurso.create({
      data,
    });
    return resource;
  }
}

export const prismaResourcesRepository = new PrismaResourcesRepository();
