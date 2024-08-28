import prisma from "@/config/prisma.config";
import { I_CreateUserBD, I_UpdateUserBody } from "./models/user.interface";
import { UserRepository } from "./user.repository";
import { Usuario } from "@prisma/client";

class PrimsaUserRepository implements UserRepository {
  async updateUser(data: I_UpdateUserBody, idUser: number): Promise<Usuario> {
    const user = await prisma.usuario.update({
      where: { id: idUser },
      data: data,
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
  ): Promise<{ users: Usuario[]; total: number } | null> {
    const [users, total]: [Usuario[], number] = await prisma.$transaction([
      prisma.usuario.findMany({
        skip,
        take: limit,
      }),
      prisma.usuario.count(),
    ]);
    return { users, total };
  }

  async findById(idUser: number): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
    });
    return user;
  }
}

export const primsaUserRepository = new PrimsaUserRepository();
