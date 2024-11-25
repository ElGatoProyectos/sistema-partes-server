import prisma from "../config/prisma.config";
import { I_CreateRolBD, I_Rol } from "./models/rol.interfaces";
import { T_FindAllRol } from "./models/rol.types";
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
  async findAll(data:T_FindAllRol): Promise<Rol[]> {
    const orderBy: any[] = [];

    if (data.queryParams.isOrder) {
      if (data.queryParams.isOrder === "true") {
        orderBy.push({ rol: "asc" }); // Orden ascendente por rol
      } else{
        orderBy.push({ rol: "desc" }); // Orden descendente por rol
      } 
    } else {
      orderBy.push({ id: "desc" }); // Orden por defecto si no hay isOrder
    }
    const roles = await prisma.rol.findMany({
      where: {
        rol: {
          notIn: ["ADMIN", "USER"], 
        },
      },
      orderBy
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
