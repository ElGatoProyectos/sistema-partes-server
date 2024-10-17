import { DetailUserProjectRepository } from "./detailUserProject.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import {
  I_CreateDetailUserProject,
  I_DetailUserProject,
} from "./models/detailUserProject.interface";
import { DetalleUsuarioProyecto } from "@prisma/client";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "../detailProductionEngineerMasterBuilder/prismaDetailProductionEngineerMasterBuilder.repository";
import { prismaDetailMasterBuilderForemanRepository } from "../detailMasterBuilderForeman/prismaDetailMasterBuilderForeman.repository";
import { prismaDetailForemanGroupLeaderRepository } from "../detailForemanGroupLeader/prisma-detailForemanGroupLeader.respository";
import { T_FindAllProject } from "@/project/dto/project.type";

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
}

export const prismaDetailUserProjectRepository =
  new PrismaDetailUserProjectRepository();

////////
// async getAllUsersOfProject(
//   skip: number,
//   data: T_FindAllDetailUserProject,
//   project_id: number,
//   userResponse: Usuario
// ): Promise<{ userAll: any[]; total: number }> {
//   let filters: any = {};
//   let users: any = [];
//   let userAll: any = [];
//   let total: any;
//   if (data.queryParams.name) {
//     filters.nombre_completo = {
//       contains: data.queryParams.name,
//     };
//   }
//   const rolResponse = await rolValidation.findById(userResponse.rol_id);
//   const rolFind = rolResponse.payload as Rol;
//   if (rolFind.rol === "INGENIERO_PRODUCCION") {
//     [users, total] = await prisma.$transaction([
//       prisma.detalleUsuarioProyecto.findMany({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//             Rol: {
//               rol: {
//                 in: ["MAESTRO_OBRA"],
//               },
//             },
//           },
//         },
//         include: {
//           Usuario: {
//             include: {
//               Rol: true,
//             },
//           },
//         },
//         skip,
//         take: data.queryParams.limit,
//       }),
//       prisma.detalleUsuarioProyecto.count({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//             Rol: {
//               rol: {
//                 in: ["MAESTRO_OBRA"],
//               },
//             },
//           },
//         },
//       }),
//     ]);
//     userAll = users.map((item: I_DetailUserProject) => {
//       const { Usuario, ...company } = item;
//       const { Rol, ...user } = Usuario;
//       return {
//         usuario: user,
//         rol: Rol,
//       };
//     });
//   } else if (rolFind.rol === "MAESTRO_OBRA") {
//     [users, total] = await prisma.$transaction([
//       prisma.detalleUsuarioProyecto.findMany({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//             Rol: {
//               rol: {
//                 in: ["CAPATAZ"],
//               },
//             },
//           },
//         },
//         include: {
//           Usuario: {
//             include: {
//               Rol: true,
//             },
//           },
//         },
//         skip,
//         take: data.queryParams.limit,
//       }),
//       prisma.detalleUsuarioProyecto.count({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//             Rol: {
//               rol: {
//                 in: ["CAPATAZ"],
//               },
//             },
//           },
//         },
//       }),
//     ]);
//     userAll = users.map((item: I_DetailUserProject) => {
//       const { Usuario, ...company } = item;
//       const { Rol, ...user } = Usuario;
//       return {
//         usuario: user,
//         rol: Rol,
//       };
//     });
//   } else {
//     [users, total] = await prisma.$transaction([
//       prisma.detalleUsuarioProyecto.findMany({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//           },
//         },
//         include: {
//           Usuario: {
//             include: {
//               Rol: true,
//             },
//           },
//         },
//         skip,
//         take: data.queryParams.limit,
//       }),
//       prisma.detalleUsuarioProyecto.count({
//         where: {
//           projecto_id: project_id,
//           Usuario: {
//             ...filters,
//           },
//         },
//       }),
//     ]);
//     userAll = users.map((item: I_DetailUserProject) => {
//       const { Usuario, ...company } = item;
//       const { Rol, ...user } = Usuario;
//       return {
//         usuario: user,
//         rol: Rol,
//       };
//     });
//   }
//   return { userAll, total };
// }
