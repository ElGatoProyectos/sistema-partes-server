import prisma from "../config/prisma.config";
import { I_CreateRolBD, I_Rol } from "./models/rol.interfaces";
import { RolRepository } from "./rol.repository";
import { E_Estado_BD, Rol } from "@prisma/client";

class PrismaRolRepository implements RolRepository {
  async findByName(name: string): Promise<Rol | null> {
    const rol = await prisma.rol.findFirst({
      where: {
        rol: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return rol;
  }
  async existsName(name: string): Promise<Rol | null> {
    const rolResponse = await prisma.rol.findFirst({
      where: {
        rol: name,
      },
    });
    return rolResponse;
  }

  async createRol(data: I_CreateRolBD): Promise<Rol> {
    const user = await prisma.rol.create({
      data,
    });
    return user;
  }
  async findAll(): Promise<Rol[]> {
    const roles = await prisma.rol.findMany({
      where: {
        rol: {
          notIn: ["ADMIN", "USER"], // Excluye tanto "ADMIN" como "USER"
        },
      },
    });
    return roles;
  }
  async findById(idRol: number): Promise<I_Rol | null> {
    const rol = await prisma.rol.findFirst({
      where: {
        id: idRol,
        eliminado: E_Estado_BD.n,
      },
    });
    return rol;
  }
}

export const prismaRolRepository = new PrismaRolRepository();
