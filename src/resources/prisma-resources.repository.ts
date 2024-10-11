import prisma from "@/config/prisma.config";
import { ResourcesRepository } from "./resources.repository";
import {
  I_CreateResourcesBD,
  I_Resources,
  I_UpdateResourcesBodyValidation,
} from "./models/resources.interface";
import { E_Estado_BD, Recurso } from "@prisma/client";

class PrismaResourcesRepository implements ResourcesRepository {
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

  findAll(project_id: number): void {
    throw new Error("Method not implemented.");
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
