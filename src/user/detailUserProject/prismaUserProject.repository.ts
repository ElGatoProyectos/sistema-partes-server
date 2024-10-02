import { DetailUserProjectRepository } from "./detailUserProject.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import {
  I_CreateDetailUserProject,
  I_DetailUserProject,
} from "./models/detailUserProject.interface";
import { DetalleUsuarioProyecto } from "@prisma/client";

class PrismaDetailUserProjectRepository implements DetailUserProjectRepository {
  async getAllUsersOfProject(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre = {
        contains: data.queryParams.name,
      };
    }
    [users, total] = await prisma.$transaction([
      prisma.detalleUsuarioProyecto.findMany({
        where: {
          projecto_id: project_id,
          Usuario: {
            ...filters,
          },
        },
        include: {
          Usuario: {
            include: {
              Rol: true,
            },
          },
        },
        skip,
        take: data.queryParams.limit,
      }),
      prisma.detalleUsuarioProyecto.count({
        where: {
          projecto_id: project_id,
          Usuario: {
            ...filters,
          },
        },
      }),
    ]);
    const userAll = users.map((item: I_DetailUserProject) => {
      const { Usuario, ...company } = item;
      const { Rol, ...user } = Usuario;
      return {
        usuario: user,
        rol: Rol,
      };
    });
    return { userAll, total };
  }
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
