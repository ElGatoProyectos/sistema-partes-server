import prisma from "../config/prisma.config";
import {
  I_AllUsers,
  I_CreateUserBD,
  I_UpdateUserBD,
  I_User,
  IAssignUserPermissions,
} from "./models/user.interface";
import { UserRepository } from "./user.repository";
import { Accion, E_Estado_BD, Seccion, Usuario } from "@prisma/client";

class PrismaUserRepository implements UserRepository {
  async assignUserPermissions(data: IAssignUserPermissions) {
    const resultDetailUserProject = await prisma.detalleUsuarioProyecto.create({
      data: {
        usuario_id: data.user_id,
        projecto_id: data.project_id,
      },
    });
    let permisos = [];
    for (let i = 0; i < data.actions.length; i++) {
      const permiso = await prisma.permisos.create({
        data: {
          seccion_id: +data.section.id,
          accion_id: data.actions[i].id,
          rol_id: data.rol_id,
        },
      });
      permisos.push(permiso);
    }

    return {
      detalleUsuarioProyecto: resultDetailUserProject,
      permisos,
    };
  }

  async updaterRolUser(idUser: number, idRol: number): Promise<Usuario> {
    const user = await prisma.usuario.update({
      where: {
        id: idUser,
      },
      data: {
        rol_id: idRol,
      },
    });
    return user;
  }
  async existsEmail(email: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        email,
      },
    });
    return user;
  }
  async searchNameUser(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ users: Usuario[]; total: number }> {
    const [users, total]: [Usuario[], number] = await prisma.$transaction([
      prisma.usuario.findMany({
        where: {
          nombre_completo: {
            contains: name,
          },
        },
        skip,
        take: limit,
      }),
      prisma.usuario.count({
        where: {
          nombre_completo: {
            contains: name,
          },
        },
      }),
    ]);
    return { users, total };
  }
  async findByDni(dni: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        dni,
      },
    });
    return user;
  }
  async updateStatusUser(idUser: number): Promise<Usuario> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
    });

    const newStateUser =
      user?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const userUpdate = await prisma.usuario.update({
      where: { id: idUser },
      data: {
        eliminado: newStateUser,
      },
    });
    return userUpdate;
  }
  async updateUser(data: I_UpdateUserBD, idUser: number): Promise<Usuario> {
    const user = await prisma.usuario.update({
      where: { id: idUser },
      data,
    });

    return user;
  }

  async createUser(data: I_CreateUserBD): Promise<Usuario> {
    const user = await prisma.usuario.create({
      data,
    });
    return user;
  }
  async findAll(
    skip: number,
    limit: number,
    name: string
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};

    if (name) {
      filters.nombre_completo = {
        contains: name,
      };
    }

    const [users, total] = await prisma.$transaction([
      prisma.usuario.findMany({
        where: {
          ...filters,
          Rol: {
            rol: {
              not: "ADMIN",
            },
          },
        },
        include: {
          Rol: true,
          Empresa: true,
        },
        skip,
        take: limit,
        omit: {
          contrasena: true,
        },
      }),
      prisma.usuario.count({
        where: {
          ...filters,
          Rol: {
            rol: {
              not: "ADMIN",
            },
          },
        },
      }),
    ]);

    const userAll = users.map((item) => {
      const { Rol, Empresa, ...user } = item;
      return {
        rol: Rol,
        empresa: Empresa[0],
        user,
      };
    });

    return { userAll, total };
  }

  async findById(idUser: number): Promise<I_User | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
      include: {
        Rol: true,
      },
      omit: {
        contrasena: true,
        eliminado: true,
      },
    });
    return user;
  }
}

export const prismaUserRepository = new PrismaUserRepository();
