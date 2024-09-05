import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaProyectoRepository } from "./prisma-project.repository";
import {
  I_CreateUserBody,
  I_UpdateProyectBody,
} from "./models/project.interface";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "./models/project.constant";
import fs from "fs/promises";
import { converToDate } from "@/common/utils/date";
import { T_FindAll } from "@/common/models/pagination.types";
import { userService } from "@/user/user.service";
import validator from "validator";
import { companyService } from "@/company/company.service";

class ProjectService {
  isNumeric(word: string) {
    if (!validator.isNumeric(word)) {
      return true;
    } else {
      return false;
    }
  }

  async createProject(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      data.empresa_id = Number(data.empresa_id);
      const resultCompany = await companyService.findById(data.empresa_id);
      if (!resultCompany.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el proyecto con el id de la empresa proporcionado"
        );
      }
      const resultCostoProyecto = this.isNumeric(data.costo_proyecto);
      if (resultCostoProyecto) {
        return httpResponse.BadRequestException(
          "El campo costo proyecto debe contener solo números"
        );
      }
      const resultPlazoProyecto = this.isNumeric(data.plazo_proyecto);
      if (resultPlazoProyecto) {
        return httpResponse.BadRequestException(
          "El campo plazo proyecto debe contener solo números"
        );
      }
      const resultCodigoProyecto = this.isNumeric(data.codigo_proyecto);
      if (resultCodigoProyecto) {
        return httpResponse.BadRequestException(
          "El campo codigo proyecto debe contener solo números"
        );
      }
      const fecha_creacion = converToDate(data.fecha_creacion);
      const fecha_fin = converToDate(data.fecha_fin);
      const proyectFormat = {
        ...data,
        costo_proyecto: Number(data.costo_proyecto),
        plazo_proyecto: data.plazo_proyecto,
        codigo_proyecto: data.codigo_proyecto,
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
        " Error al crear proyecto",
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
      data.empresa_id = Number(data.empresa_id);
      const companyResponse = await companyService.findById(data.empresa_id);
      if (!companyResponse.success) {
        return httpResponse.BadRequestException(
          "No se pudo crear el proyecto con el id de la empresa proporcionado"
        );
      }
      const resultCostoProyecto = this.isNumeric(data.costo_proyecto);
      if (resultCostoProyecto) {
        return httpResponse.BadRequestException(
          "El campo costo proyecto debe contener solo números"
        );
      }
      const resultPlazoProyecto = this.isNumeric(data.plazo_proyecto);
      if (resultPlazoProyecto) {
        return httpResponse.BadRequestException(
          "El campo plazo proyecto debe contener solo números"
        );
      }
      const resultCodigoProyecto = this.isNumeric(data.codigo_proyecto);
      if (resultCodigoProyecto) {
        return httpResponse.BadRequestException(
          "El campo codigo proyecto debe contener solo números"
        );
      }
      const projectResponse = await this.findById(idProject);
      if (!projectResponse.success) return projectResponse;
      let fecha_creacion = new Date(data.fecha_creacion);
      let fecha_fin = new Date(data.fecha_fin);

      const proyectFormat = {
        ...data,
        costo_proyecto: data.costo_proyecto,
        fecha_creacion: fecha_creacion,
        fecha_fin: fecha_fin,
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
        " Error al modificar el proyecto",
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
        return httpResponse.BadRequestException(" La Imagen no fue encontrada");
      }

      return httpResponse.SuccessResponse("Imagen encontrada", imagePath);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la imagen",
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
        return httpResponse.NotFoundException("Id del proyecto no encontrado");
      }
      return httpResponse.SuccessResponse("Proyecto encontrado", project);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaProyectoRepository.searchNameProject(
        name,
        skip,
        data.queryParams.limit
      );

      if (!result) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      const { projects, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: projects,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar proyectos",
        formData
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        " Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAllProjectsXUser(idUser: number, data: T_FindAll) {
    try {
      const userResponse = await userService.findById(idUser);
      if (!userResponse.success) {
        return httpResponse.BadRequestException(
          "El id del usuario proporcionado no existe "
        );
      }
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaProyectoRepository.allProjectsuser(
        idUser,
        skip,
        data.queryParams.limit
      );
      if (!result)
        return httpResponse.SuccessResponse("No se encontraron projectos.", 0);
      const { projects, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: projects,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los proyectos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al traer todos los proyectos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusProject(idProject: number): Promise<T_HttpResponse> {
    try {
      const projectResponse = await this.findById(idProject);
      if (!projectResponse.success) {
        return projectResponse;
      } else {
        const result = await prismaProyectoRepository.updateStatusProject(
          idProject
        );
        return httpResponse.SuccessResponse(
          "Proyecto eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al eliminar el proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const projectService = new ProjectService();
