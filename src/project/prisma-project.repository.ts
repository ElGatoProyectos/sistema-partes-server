import prisma from "@/config/prisma.config";
import {
  I_Project,
  I_CreateProjectBD,
  I_UpdateProjectBD,
} from "./models/project.interface";
import { ProjectRepository } from "./project.repository";
import { E_Estado_BD, E_Proyecto_Estado, Proyecto } from "@prisma/client";

class PrismaProjectRepository implements ProjectRepository {
  async searchNameProject(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ projects: I_Project[]; total: number }> {
    const [projects, total]: [I_Project[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          nombre_completo: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.proyecto.count({
        where: {
          nombre_completo: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { projects, total };
  }

  async allProjectsuser(
    idCompany: number,
    skip: number,
    limit: number
  ): Promise<{ projects: I_Project[]; total: number }> {
    const [projects, total]: [I_Project[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          empresa_id: idCompany,
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.proyecto.count({
        where: {
          empresa_id: idCompany,
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { projects, total };
  }

  findById = async (idProject: number) => {
    const project = await prisma.proyecto.findFirst({
      where: {
        id: idProject,
      },
      omit: {
        eliminado: true,
      },
    });
    return project;
  };

  async updateStatusProject(idProject: number): Promise<Proyecto> {
    const project = await prisma.proyecto.findFirst({
      where: {
        id: idProject,
      },
    });
    const newStateProject =
      project?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const projectUpdate = await prisma.proyecto.update({
      where: { id: idProject },
      data: {
        eliminado: newStateProject,
      },
    });
    return projectUpdate;
  }
  async updateProject(
    dataa: I_UpdateProjectBD,
    idProject: number
  ): Promise<Proyecto> {
    const updatedData: I_CreateProjectBD = {
      ...dataa,
      costo_proyecto: Number(dataa.costo_proyecto),
    };

    const project = await prisma.proyecto.update({
      where: { id: idProject },
      data: updatedData,
    });

    return project;
  }

  async createProject(data: I_CreateProjectBD): Promise<Proyecto> {
    const project = await prisma.proyecto.create({
      data: data,
    });
    return project;
  }
}

export const prismaProyectoRepository = new PrismaProjectRepository();
