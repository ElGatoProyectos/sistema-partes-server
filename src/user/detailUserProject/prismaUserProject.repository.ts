import { DetailUserProjectRepository } from "./detailUserProject.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import {
  I_CreateDetailUserProject,
  I_DetailUserProject,
} from "./models/detailUserProject.interface";
import { DetalleUsuarioProyecto, Rol } from "@prisma/client";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "../detailProductionEngineerMasterBuilder/prismaDetailProductionEngineerMasterBuilder.repository";
import { prismaDetailMasterBuilderForemanRepository } from "../detailMasterBuilderForeman/prismaDetailMasterBuilderForeman.repository";
import { prismaDetailForemanGroupLeaderRepository } from "../detailForemanGroupLeader/prisma-detailForemanGroupLeader.respository";
import { T_FindAllProject } from "@/project/dto/project.type";
import { rolValidation } from "@/rol/rol.validation";

class PrismaDetailUserProjectRepository implements DetailUserProjectRepository {
  async getAllProjectsOfUser(
    user_id: number,
    data: T_FindAllProject,
    skip: number
  ): Promise<{ projects: any[]; total: number }> {
    let filters: any = {};
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
    const projectsAll = await prisma.detalleUsuarioProyecto.findMany({
      where: {
        // ...filters,
        Proyecto: {
          ...filters,
        },
        usuario_id: user_id,
      },
      include: {
        Proyecto: true,
      },
      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.detalleUsuarioProyecto.count({
      where: {
        // ...filters,
        usuario_id: user_id,
      },
    });
    const projects = projectsAll.map((item) => {
      const { Proyecto } = item;
      return {
        ...Proyecto,
      };
    });
    return { projects, total };
  }

  async existsUser(user_id: number): Promise<DetalleUsuarioProyecto | null> {
    const detail = await prisma.detalleUsuarioProyecto.findFirst({
      where: {
        usuario_id: user_id,
      },
    });
    return detail;
  }
  async getAllUsersOfProject(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number,
    nameRol: string
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let userAll: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    if (
      nameRol === "ADMIN" ||
      nameRol === "USER" ||
      nameRol === "CONTROL_COSTOS"
    ) {
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
    } else if (nameRol === "INGENIERO_PRODUCCION") {
      const { userAll, total } =
        await prismaDetailProductionEngineerMasterBuilderRepository.getAllDetailProductionEngineerMasterBuilder(
          skip,
          data,
          project_id,
          user_id
        );
      return { userAll, total };
    } else if (nameRol === "MAESTRO_OBRA") {
      const { userAll, total } =
        await prismaDetailMasterBuilderForemanRepository.getAllDetailMasterBuilderForeman(
          skip,
          data,
          project_id,
          user_id
        );
      return { userAll, total };
    } else if (nameRol === "CAPATAZ") {
      const { userAll, total } =
        await prismaDetailForemanGroupLeaderRepository.getAllDetailForemanGroupLeader(
          skip,
          data,
          project_id,
          user_id
        );
      return { userAll, total };
    }

    return { userAll, total };
  }
  async getAllUsersAvailableOfProject(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number,
    nameRol: string
  ): Promise<{ userAll: any[]; total: number }> {
    let ids: any = [];
    let userAll: any = [];
    let total: any;

    if (nameRol === "INGENIERO_PRODUCCION") {
      const usersNotProductionEngineer =
        await prisma.detalleIngenieroProduccionMaestroObra.findMany({
          where: {
            usuario_ingeniero_id: user_id,
            proyecto_id: project_id,
          },
        });

      const idsIngenieros = usersNotProductionEngineer.map(
        (user) => user.usuario_produccion_id
      );
      idsIngenieros.push(user_id);
      ids = idsIngenieros.length > 0 ? idsIngenieros : [];
      const masterBuilderResponse = await rolValidation.findByName(
        "MAESTRO_OBRA"
      );
      const rolMasterBuilder = masterBuilderResponse.payload as Rol;
      userAll = await this.getAll(
        skip,
        data,
        ids,
        project_id,
        rolMasterBuilder.id
      );

      total = await this.totalUsers(project_id, ids, rolMasterBuilder.id);
      return { userAll, total };
    } else if (nameRol === "MAESTRO_OBRA") {
      const usersNotMasterBuilder =
        await prisma.detalleMaestroObraCapataz.findMany({
          where: {
            usuario_mo_id: user_id,
            proyecto_id: project_id,
          },
        });
      const idsCapataz = usersNotMasterBuilder.map(
        (user) => user.usuario_capataz_id
      );
      idsCapataz.push(user_id);
      ids = idsCapataz.length > 0 ? idsCapataz : [];
      const foremanResponse = await rolValidation.findByName("CAPATAZ");
      const rolForeman = foremanResponse.payload as Rol;
      userAll = await this.getAll(skip, data, ids, project_id, rolForeman.id);
      total = await this.totalUsers(project_id, ids, rolForeman.id);
      return { userAll, total };
    } else if (nameRol === "CAPATAZ") {
      const usersNotForeman = await prisma.detalleCapatazJefeGrupo.findMany({
        where: {
          usuario_capataz_id: user_id,
          proyecto_id: project_id,
        },
      });
      const idsGroupLeader = usersNotForeman.map(
        (user) => user.usuario_jefe_grupo_id
      );
      idsGroupLeader.push(user_id);
      ids = idsGroupLeader.length > 0 ? idsGroupLeader : [];
      const groupLeaderResponse = await rolValidation.findByName("JEFE_GRUPO");
      const rolGroupLeader = groupLeaderResponse.payload as Rol;
      userAll = await this.getAll(
        skip,
        data,
        ids,
        project_id,
        rolGroupLeader.id
      );
      total = await this.totalUsers(project_id, ids, rolGroupLeader.id);
      return { userAll, total };
    }

    return { userAll, total };
  }
  async getAllUsersOfProjectUnassigned(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    [users, total] = await prisma.$transaction([
      prisma.detalleUsuarioProyecto.findMany({
        where: {
          projecto_id: project_id,
          Usuario: {
            ...filters,
            // Rol: {
            //   rol: "NO_ASIGNADO",
            // },
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
  async findByUser(
    user_id: number,
    project_id: number
  ): Promise<DetalleUsuarioProyecto | null> {
    const detail = await prisma.detalleUsuarioProyecto.findFirst({
      where: {
        usuario_id: user_id,
        projecto_id: project_id,
      },
    });
    return detail;
  }
  async deleteUserByDetail(
    idDetailUserProject: number
  ): Promise<DetalleUsuarioProyecto> {
    const detailUserProjectDeleted = await prisma.detalleUsuarioProyecto.delete(
      {
        where: {
          id: idDetailUserProject,
        },
      }
    );
    return detailUserProjectDeleted;
  }

  async createUserProject(
    data: I_CreateDetailUserProject
  ): Promise<DetalleUsuarioProyecto | null> {
    const detailUserProject = await prisma.detalleUsuarioProyecto.create({
      data: data,
    });
    return detailUserProject;
  }

  async getAll(
    skip: number,
    data: T_FindAllDetailUserProject,
    ids: number[],
    project_id: number,
    rol_id: number
  ) {
    const userAll = await prisma.detalleUsuarioProyecto.findMany({
      where: {
        Usuario: {
          Rol: {
            id: rol_id,
          },
        },
        usuario_id: {
          notIn: ids,
        },
        projecto_id: project_id,
      },
      include: {
        Usuario: {
          include: {
            Rol: true,
          },
          omit: {
            contrasena: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });
    return userAll;
  }
  async totalUsers(project_id: number, ids: number[], rol_id: number) {
    const total = await prisma.detalleUsuarioProyecto.count({
      where: {
        Usuario: {
          Rol: {
            id: rol_id,
          },
        },
        usuario_id: {
          notIn: ids,
        },
        projecto_id: project_id,
      },
    });
    return total;
  }
}

export const prismaDetailUserProjectRepository =
  new PrismaDetailUserProjectRepository();
