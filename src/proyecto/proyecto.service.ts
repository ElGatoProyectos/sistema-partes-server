import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { I_CreateProyectoBD } from "./models/proyecto.interface";
import prisma from "@/config/prisma.config";
import { prismaProyectoRepository } from "./prisma-proyecto.repository";

class ProyectoService {
  async createProject(data: I_CreateProyectoBD): Promise<T_HttpResponse> {
    try {
      const project = await prismaProyectoRepository.createProject(data);
      return httpResponse.CreatedResponse(
        "Proyecto creado correctamente",
        project
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al crear proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const projectService = new ProyectoService();
