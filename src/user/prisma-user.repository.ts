import prisma from "@/config/prisma.config";
import { I_CreateUserBD } from "./models/user.interface";
import { UserRepository } from "./user.repository";
import { Usuario } from "@prisma/client";

class PrimsaUserRepository implements UserRepository {
  async createUser(data: I_CreateUserBD): Promise<Usuario> {
    const user = await prisma.usuario.create({
      data,
    });
    return user;
  }
  findAll(): string {
    // llama a prisma
    return "";
  }
  findOne(): string {
    return "";
  }
}

export const primsaUserRepository = new PrimsaUserRepository();
