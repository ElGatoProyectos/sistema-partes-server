import prisma from "@/config/prisma.config";
import { I_CreateRolBD } from "./models/rol.interfaces";
import { RolRepository } from "./rol.repository";
import { Rol } from "@prisma/client";

class PrismaRolRepository implements RolRepository {
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
    const roles = await prisma.rol.findMany();
    return roles;
  }
  async findById(idRol: number): Promise<Rol | null> {
    const rol = await prisma.rol.findFirst({
      where: {
        id: idRol,
      },
    });
    return rol;
  }
}

export const prismaRolRepository = new PrismaRolRepository();
