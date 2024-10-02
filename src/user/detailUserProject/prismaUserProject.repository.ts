import { DetalleUsuarioProyecto } from "@prisma/client";
import { DetailUserProjectRepository } from "./detailUserProject.repository";
import prisma from "@/config/prisma.config";
import { I_CreateDetailUserProject } from "./models/detailUserProject.interface";

class PrismaDetailUserProjectRepository implements DetailUserProjectRepository {
  async createUserProject(
    data: I_CreateDetailUserProject
  ): Promise<DetalleUsuarioProyecto | null> {
    const detailUserProject = await prisma.detalleUsuarioProyecto.create({
      data: data,
    });
    return detailUserProject;
  }
}

export const prismaDetailUserProjectRepository =
  new PrismaDetailUserProjectRepository();
