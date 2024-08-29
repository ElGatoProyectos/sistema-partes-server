import prisma from "@/config/prisma.config";
import { I_CreateProyectoBD } from "./models/proyecto.interface";
import { ProyectoRepository } from "./proyecto.repository";
import { Proyecto } from "@prisma/client";

class PrismaProyectoRepository implements ProyectoRepository {
  async createProject(data: I_CreateProyectoBD): Promise<Proyecto> {
    // Convertir las fechas de cadena a objetos Date
    const fecha_creacion = new Date(data.fecha_creacion);
    const fecha_fin = new Date(data.fecha_fin);

    // Crear el proyecto con las fechas convertidas
    const project = await prisma.proyecto.create({
      data: {
        ...data,
        fecha_creacion, // Asignar la fecha convertida
        fecha_fin, // Asignar la fecha convertida
      },
    });
    return project;
  }
}

export const prismaProyectoRepository = new PrismaProyectoRepository();
