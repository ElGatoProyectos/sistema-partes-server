import prisma from "../config/prisma.config";
import {
  I_Project,
  I_CreateProjectBD,
  I_UpdateProjectBD,
  I_UpdateColorsProject,
} from "./models/project.interface";
import { ProjectRepository } from "./project.repository";
import { E_Estado_BD, E_Proyecto_Estado, Proyecto } from "@prisma/client";
import { T_FindAllProject } from "./dto/project.type";

class PrismaProjectRepository implements ProjectRepository {
 async  findAllWithOutPagination(): Promise<Proyecto[]| null> {
   const projects= await prisma.proyecto.findMany({
    where:{
      eliminado: E_Estado_BD.n
    }
   })
   return projects
  }
  async totalProjectsByCompany(company_id: number): Promise<Number> {
    const usersCompany = await prisma.proyecto.count({
      where: {
        empresa_id: company_id,
      },
    });
    return usersCompany;
  }
  async codeMoreHigh(company_id: number): Promise<Proyecto | null> {
    const lastProject = await prisma.proyecto.findFirst({
      where: {
        // eliminado: E_Estado_BD.n,
        empresa_id: company_id,
      },
      orderBy: { codigo_proyecto: "desc" },
    });
    return lastProject;
  }
  async updateStateProject(
    idProject: number,
    stateProject: E_Proyecto_Estado | undefined
  ): Promise<Proyecto> {
    const project = await prisma.proyecto.update({
      where: { id: idProject },
      data: {
        estado: stateProject,
      },
    });

    return project;
  }
  async searchNameProject(
    data: T_FindAllProject,
    skip: number
  ): Promise<{ projects: I_Project[]; total: number }> {
    let filters: any = {};
    if (data.queryParams.state) {
      filters.estado = data.queryParams.state.toUpperCase();
    }
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    const [projects, total]: [I_Project[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
        },
        skip: skip,
        take: data.queryParams.limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.proyecto.count({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { projects, total };
  }

  async allProjectsAdminUser(
    company_id: number,
    data: T_FindAllProject,
    skip: number
  ): Promise<{ projects: I_Project[]; total: number }> {
    let filters: any = {};
    // if (data.queryParams.state) {
    //   filters.estado = data.queryParams.state.toUpperCase();
    // }
    if (
      data.queryParams.state &&
      data.queryParams.state.toUpperCase() !== "TODOS"
    ) {
      filters.estado = data.queryParams.state.toUpperCase();
    }
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    const [projects, total]: [I_Project[], number] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where: {
          ...filters,
          empresa_id: company_id,
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: data.queryParams.limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.proyecto.count({
        where: {
          ...filters,
          empresa_id: company_id,
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
    dataProject: I_UpdateProjectBD,
    idProject: number
  ): Promise<Proyecto> {
    const updatedData: I_CreateProjectBD = {
      ...dataProject,
      costo_proyecto: Number(dataProject.costo_proyecto),
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

  async updateColorsProject(
    project_id: number,
    data: I_UpdateColorsProject
  ): Promise<Proyecto> {
    const project = await prisma.proyecto.update({
      where: {
        id: project_id,
      },
      data: data,
    });
    return project;
  }

  async deleteManyFromProyect(proyect_id: number) {
    await prisma.detalleUsuarioEmpresa.deleteMany();
    // await prisma.usuario.deleteMany({
    //   where: {
    //     Rol: {
    //       rol: {
    //         not: "ADMIN",
    //       },
    //     },
    //   },
    // });
    // await prisma.proyecto.delete({
    //   where: { id: proyect_id },
    // });
  }
}

export const prismaProyectoRepository = new PrismaProjectRepository();
