import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaProyectoRepository } from "./prisma-project.repository";
import {
  I_CreateCompanyBody,
  I_UpdateColorsProject,
  I_UpdateProyectBody,
} from "./models/project.interface";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "./models/project.constant";
import fs from "fs/promises";
import { converToDate } from "@/common/utils/date";
import validator from "validator";
import { ProjectResponseMapper } from "./mapper/project.mapper";
import { companyValidation } from "@/company/company.validation";
import { projectValidation } from "./project.validation";
import { jwtService } from "@/auth/jwt.service";
import {
  DetalleUsuarioProyecto,
  E_Proyecto_Estado,
  Empresa,
  Proyecto,
  Rol,
  Usuario,
} from "@prisma/client";
import { T_FindAllProject } from "./dto/project.type";
import { rolValidation } from "@/rol/rol.validation";
import { weekService } from "@/week/week.service";
import { categoryWorkforceService } from "@/categoryWorkforce/categoryWorkforce.service";
import { bankWorkforceService } from "@/bankWorkforce/bankWorkforce.service";
import { originWorkforceService } from "@/originWorkforce/originWorkforce.service";
import { specialtyWorkforceService } from "@/specialtyWorkforce/specialtyWorkforce.service";
import { typeWorkforceService } from "@/typeWorkforce/typeWorkforce.service";
import { unitService } from "@/unit/unit.service";
import { unifiedIndexService } from "@/unifiedIndex/unifiedIndex.service";
import { resourseCategoryService } from "@/resourseCategory/resourseCategory.service";
import { detailProjectValidation } from "@/user/detailUserProject/detailUserProject.validation";
import { prismaDetailUserProjectRepository } from "@/user/detailUserProject/prismaUserProject.repository";
import { detailWeekProjectValidation } from "@/week/detailWeekProject/detailWeekProject.validation";
import { weekValidation } from "@/week/week.validation";
import { detailWeekProjectService } from "@/week/detailWeekProject/detailWeekProject.service";

class ProjectService {
  isNumeric(word: string) {
    if (!validator.isNumeric(word)) {
      return true;
    } else {
      return false;
    }
  }

  async createProject(
    data: I_CreateCompanyBody,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const date = new Date();

      const weekResponse = await weekService.createWeek(date.getFullYear());
      if (!weekResponse.success) {
        return weekResponse;
      }

      const resultCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      if (!resultCompany.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el proyecto con el id de la empresa proporcionado"
        );
      }

      const company = resultCompany.payload as Empresa;

      const totalProjects = await projectValidation.totalProjectsByCompany(
        company.id
      );

      if (!totalProjects.success) {
        return totalProjects;
      }

      const total = totalProjects.payload as Number;

      const rolResponse = await rolValidation.findByName("ADMIN");
      const rol = rolResponse.payload as Rol;

      if (
        userResponse.rol_id != rol.id &&
        total === userResponse.limite_proyecto
      ) {
        return httpResponse.BadRequestException(
          "Alcanzó el límite de proyectos la empresa"
        );
      }

      const lastProject = await projectValidation.codeMoreHigh(company.id);
      const lastProjectResponse = lastProject.payload as Proyecto;

      // Incrementar el código en 1
      const nextCodigo =
        (parseInt(lastProjectResponse?.codigo_proyecto) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const fecha_creacion = converToDate(data.fecha_inicio);
      const fecha_fin = converToDate(data.fecha_fin);
      let proyectFormat: any = {};
      proyectFormat = {
        ...data,
        codigo_proyecto: formattedCodigo,
        estado: E_Proyecto_Estado.CREADO,
        costo_proyecto: Number(data.costo_proyecto),
        fecha_inicio: fecha_creacion,
        fecha_fin,
        empresa_id: company.id,
      };
      const project = await prismaProyectoRepository.createProject(
        proyectFormat
      );

      //[SUCCESS] Si estuvo todo ok se crea lo siguiente
      //[NOTE]:  TIPO DE MANO DE OBRA
      const typeWorkforce = await typeWorkforceService.createMasive(project.id);
      if (!typeWorkforce.success) {
        return typeWorkforce;
      }
      //[NOTE]:  ORIGEN DE MANO DE OBRA
      const responseOriginWorkforce = await originWorkforceService.createMasive(
        project.id
      );
      if (!responseOriginWorkforce.success) {
        return responseOriginWorkforce;
      }
      //[NOTE]:  CATEGORIA DE MANO DE OBRA
      const responseCategoryWorkforce =
        await categoryWorkforceService.createMasive(project.id);
      if (!responseCategoryWorkforce.success) {
        return responseCategoryWorkforce;
      }
      //[NOTE]:  ESPECIALIDAD DE MANO DE OBRA
      const specialtyWorkforce = await specialtyWorkforceService.createMasive(
        project.id
      );
      if (!specialtyWorkforce.success) {
        return specialtyWorkforce;
      }
      //[NOTE]:  UNIDAD QUE LUEGO PUEDE SER USADO POR RECURSOS O MANO DE OBRA
      const unitReponse = await unitService.createMasive(
        company.id,
        project.id
      );
      if (!unitReponse.success) {
        return unitReponse;
      }
      //[NOTE]:  TIPOS DE BANCO PARA MANO DE OBRA
      const responseBankWorkforce = await bankWorkforceService.createMasive(
        project.id
      );
      if (!responseBankWorkforce.success) {
        return responseBankWorkforce;
      }
      //[NOTE]:  INDICE UNIFICADO DE RECURSOS
      const responseUnifiedIndex = await unifiedIndexService.createMasive(
        company.id,
        project.id
      );
      if (!responseUnifiedIndex.success) {
        return responseUnifiedIndex;
      }
      //[NOTE]:  CATEGORIA DE LOS RECURSOS
      const resourcesCategory = await resourseCategoryService.createMasive(
        project.id
      );
      if (!resourcesCategory.success) {
        return resourcesCategory;
      }

      const projectMapper = new ProjectResponseMapper(project);
      return httpResponse.CreatedResponse(
        "Proyecto creado correctamente",
        projectMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateProject(
    data: I_UpdateProyectBody,
    project_id: number,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const resultCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      if (!resultCompany.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el proyecto con el id de la empresa proporcionado"
        );
      }

      const company = resultCompany.payload as Empresa;

      const projectResponse = await projectValidation.findById(project_id);
      if (!projectResponse.success) return projectResponse;
      let fecha_creacion = new Date(data.fecha_inicio);
      let fecha_fin = new Date(data.fecha_fin);

      const proyectFormat = {
        ...data,
        fecha_inicio: fecha_creacion,
        fecha_fin: fecha_fin,
        empresa_id: company.id,
      };

      const project = await prismaProyectoRepository.updateProject(
        proyectFormat,
        project_id
      );
      const projectMapper = new ProjectResponseMapper(project);
      return httpResponse.SuccessResponse(
        "Proyecto modificado correctamente",
        projectMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el proyecto",
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
        "Error al buscar la imagen",
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
        "Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(data: T_FindAllProject): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaProyectoRepository.searchNameProject(
        data,
        skip
      );
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
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAllProjectsXCompany(token: string, data: T_FindAllProject) {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse.success) return userTokenResponse;

      const userResponse = userTokenResponse.payload as Usuario;
      const rolResponse = await rolValidation.findById(userResponse.rol_id);
      const userRol = rolResponse.payload as Rol;
      let company: any = {};
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      if (userRol.rol === "ADMIN" || userRol.rol === "USER") {
        const companyResponse = await companyValidation.findByIdUser(
          userResponse.id
        );
        if (!companyResponse.success) {
          return companyResponse;
        }
        company = companyResponse.payload as Empresa;

        const result = await prismaProyectoRepository.allProjectsAdminUser(
          company.id,
          data,
          skip
        );

        return this.constructSuccessResponse(result, data);
      } else {
        const detailResponse = await detailProjectValidation.existsUser(
          userResponse.id
        );
        if (!detailResponse.success) {
          return detailResponse;
        }

        const result =
          await prismaDetailUserProjectRepository.getAllProjectsOfUser(
            userResponse.id,
            data,
            skip
          );

        // Construcción de response
        return this.constructSuccessResponse(result, data);
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los proyectos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  private constructSuccessResponse(result: any, data: T_FindAllProject) {
    const { projects, total } = result;
    const pageCount = Math.ceil(total / data.queryParams.limit);

    const formData = {
      total,
      page: data.queryParams.page,
      limit: data.queryParams.limit,
      pageCount,
      data: projects,
    };

    return httpResponse.SuccessResponse(
      "Éxito al traer todos los proyectos",
      formData
    );
  }

  async deleteManyFromProyect(proyect_id: number): Promise<T_HttpResponse> {
    try {
      const projectResponse = await projectValidation.findById(proyect_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      await prismaProyectoRepository.deleteManyFromProyect(proyect_id);
      return httpResponse.SuccessResponse(
        "Todo relacionado al Proyecto fue eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar todo del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusProject(idProject: number): Promise<T_HttpResponse> {
    try {
      const projectResponse = await projectValidation.findById(idProject);
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
        "Error al eliminar el proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateColorsProject(
    project_id: number,
    data: I_UpdateColorsProject
  ): Promise<T_HttpResponse> {
    try {
      const projectResponse = await projectValidation.findById(project_id);
      if (!projectResponse.success) {
        return projectResponse;
      } else {
        const projectFormat: I_UpdateColorsProject = {
          color_primario: data.color_primario,
          color_personalizado: data.color_personalizado,
          color_linea: data.color_linea,
          color_detalle: data.color_detalle,
          color_menu: data.color_menu,
          color_submenu: data.color_submenu,
        };
        const result = await prismaProyectoRepository.updateColorsProject(
          project_id,
          projectFormat
        );
        return httpResponse.SuccessResponse(
          "Los colores del Proyecto fueron cambiados correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al cambiar los colore del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStateProject(
    project_id: number,
    project_state: string
  ): Promise<T_HttpResponse> {
    try {
      const projectResponse = await projectValidation.findById(project_id);
      const estadoEnum = this.stringToProyectoEstado(project_state);

      if (!projectResponse.success) {
        return projectResponse;
      } else {
        const project = projectResponse.payload as Proyecto;
        if (estadoEnum == "EJECUCION") {
          const status = await detailWeekProjectValidation.findByIdProject(
            project_id
          );
          if (!status.success) {
            const detailWeekProjectResponse =
              await detailWeekProjectService.createDetails(project);
            if (!detailWeekProjectResponse?.success) {
              return detailWeekProjectResponse;
            }
          }
        }
        const result = await prismaProyectoRepository.updateStateProject(
          project_id,
          estadoEnum
        );
        return httpResponse.SuccessResponse(
          "Estado del Proyecto cambiado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al cambiar el estado del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  stringToProyectoEstado(estado: string): E_Proyecto_Estado | undefined {
    if (
      Object.values(E_Proyecto_Estado).includes(estado as E_Proyecto_Estado)
    ) {
      return estado as E_Proyecto_Estado;
    }
    return undefined;
  }
}

export const projectService = new ProjectService();
