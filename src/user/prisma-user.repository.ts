import prisma from "@/config/prisma.config";
import {
  I_CreateUserBD,
  I_UpdateUserBD,
  I_User,
} from "./models/user.interface";
import { UserRepository } from "./user.repository";
import { E_Estado_BD, Usuario } from "@prisma/client";

class PrismaUserRepository implements UserRepository {
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
  ): Promise<{ users: Usuario[]; total: number } | null> {
    const [users, total]: [Usuario[], number] = await prisma.$transaction([
      prisma.usuario.findMany({
        where: {
          nombre_completo: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
      }),
      prisma.usuario.count({
        where: {
          nombre_completo: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
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
    limit: number
  ): Promise<{ users: I_User[]; total: number } | null> {
    const [users, total]: [I_User[], number] = await prisma.$transaction([
      prisma.usuario.findMany({
        where: {
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
        omit: {
          contrasena: true,
          eliminado: true,
        },
      }),
      prisma.usuario.count({
        where: {
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { users, total };
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
