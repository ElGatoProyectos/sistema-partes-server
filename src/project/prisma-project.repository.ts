import prisma from "@/config/prisma.config";
import {
  I_CreateProjectBD,
  I_UpdateProjectBD,
} from "./models/project.interface";
import { ProjectRepository } from "./project.repository";
import { E_Estado_BD, E_Proyecto_Estado, Proyecto } from "@prisma/client";
import { contains } from "validator";

class PrismaProjectRepository implements ProjectRepository {
  async searchNameProject(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ projects: Proyecto[]; total: number } | null> {
    const [projects, total]: [Proyecto[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          nombre_completo: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
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
  ): Promise<{ projects: Proyecto[]; total: number } | null> {
    const [projects, total]: [Proyecto[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          empresa_id: idCompany,
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
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
    dataa: I_UpdateProjectBD, // Cambié a I_UpdateProyectBody
    idProject: number
  ): Promise<Proyecto> {
    // Convertir la propiedad "costo_proyecto" de string a number
    const updatedData: I_CreateProjectBD = {
      ...dataa,
      costo_proyecto: Number(dataa.costo_proyecto), // Conversión de tipo
    };

    const project = await prisma.proyecto.update({
      where: { id: idProject },
      data: updatedData, // Usar los datos convertidos
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
