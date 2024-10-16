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
