import prisma from "@/config/prisma.config";
import fs from "fs/promises";
import {
  I_CreateProjectBD,
  I_UpdateProyectBody,
} from "./models/project.interface";
import { ProjectRepository } from "./project.repository";
import { Proyecto } from "@prisma/client";
import appRootPath from "app-root-path";
import { httpResponse } from "@/common/http.response";
import { ProjectMulterProperties } from "./models/project.constant";

class PrismaProjectRepository implements ProjectRepository {
  async allProjectsuser(idUser: number): Promise<Proyecto[]> {
    const projects = await prisma.proyecto.findMany({
      where: {
        usuario_id: idUser,
      },
    });
    return projects;
  }
  findById = async (idProject: number) => {
    const project = await prisma.proyecto.findFirst({
      where: {
        id: idProject,
      },
    });
    return project;
  };

  updateStatusProject(idProject: number): void {
    throw new Error("Method not implemented.");
  }
  async updateProject(
    data: I_UpdateProyectBody,
    idProject: number
  ): Promise<Proyecto> {
    const project = await prisma.proyecto.update({
      where: { id: idProject },
      data: data,
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
