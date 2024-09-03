import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaProyectoRepository } from "./prisma-project.repository";
import {
  I_CreateProjectBD,
  I_CreateUserBody,
  I_UpdateProyectBody,
} from "./models/project.interface";
import { primsaUserRepository } from "@/user/prisma-user.repository";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "./models/project.constant";
import fs from "fs/promises";
import { E_Proyecto_Estado, Proyecto } from "@prisma/client";
import { converToDate } from "@/common/utils/date";

class ProjectService {
  async createProject(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      data.costo_proyecto = Number(data.costo_proyecto);
      data.usuario_id = Number(data.usuario_id);
      const fecha_creacion = converToDate(data.fecha_creacion);
      const fecha_fin = converToDate(data.fecha_fin);
      const proyectFormat = {
        ...data,
        fecha_creacion,
        fecha_fin,
      };
      const project = await prismaProyectoRepository.createProject(
        proyectFormat
      );
      return httpResponse.CreatedResponse(
        "Proyecto creado correctamente",
        project
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "[s] Error al crear proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateProject(
    data: I_UpdateProyectBody,
    idProject: number
  ): Promise<T_HttpResponse> {
    try {
      const projectResponse = await this.findById(idProject);
      if (!projectResponse.success) return projectResponse;
      let fecha_creacion;
      let fecha_fin;
      data.costo_proyecto = Number(data.costo_proyecto);
      data.usuario_id = Number(data.usuario_id);

      // if (data.estado === E_Proyecto_Estado.ACTIVO)
      //   data.estado = E_Proyecto_Estado.ACTIVO;
      // if (data.estado === E_Proyecto_Estado.FINALIZADO)
      //   data.estado = E_Proyecto_Estado.FINALIZADO;
      // if (data.estado === E_Proyecto_Estado.INACTIVO)
      //   data.estado = E_Proyecto_Estado.INACTIVO;
      // if (data.estado === E_Proyecto_Estado.PENDIENTE)
      //   data.estado = E_Proyecto_Estado.PENDIENTE;
      if (data.fecha_creacion && data.fecha_fin) {
        fecha_creacion = new Date(data.fecha_creacion);
        fecha_fin = new Date(data.fecha_fin);
      }
      const proyectFormat = {
        ...data,
        fecha_creacion,
        fecha_fin,
      };

      const project = await prismaProyectoRepository.updateProject(
        proyectFormat,
        idProject
      );
      return httpResponse.SuccessResponse(
        "Proyecto modificado correctamente",
        project
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "[s] Error al modificar el proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findIdImage(idProject: number) {
    try {
      const projectResponse = await prismaProyectoRepository.findById(
        idProject
      );
      if (!projectResponse)
        return httpResponse.NotFoundException(
          "No se ha podido encontrar la imagen"
        );

      const imagePath =
        appRootPath +
        "/static/" +
        ProjectMulterProperties.folder +
        "/" +
        ProjectMulterProperties.folder +
        "_" +
        projectResponse.id +
        ".png";

      try {
        // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return httpResponse.BadRequestException(
          "[s] La Imagen no fue encontrada"
        );
      }

      return httpResponse.SuccessResponse("Imagen encontrada", imagePath);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al buscar la imagen",
        error
      );
    } finally {
      await prisma.$disconnect;
    }
  }

  async findById(idProject: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProyectoRepository.findById(idProject);
      if (!project) {
        return httpResponse.NotFoundException("Proyecto no encontrado");
      }
      return httpResponse.SuccessResponse("Proyecto encontrado", project);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAllProjectsXUser(idUser: number) {
    try {
      const projects = await prismaProyectoRepository.allProjectsuser(idUser);
      if (!projects)
        return httpResponse.SuccessResponse("No se encontraron projects.", 0);
      return httpResponse.SuccessResponse("Proyectos encontrados", projects);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al traer todos los proyectos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const projectService = new ProjectService();
