import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateResourseCategoryBody,
  I_UpdateResourseCategoryBody,
} from "./models/resourseCategory.interface";
import { resourseCategoryValidation } from "./resourseCategory.validation";
import { prismaResourseCategoryRepository } from "./prisma-resourse-category.repository";
import { ResourseCategoryMapper } from "./mapper/resourseCategory.mapper";
import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import { CategoriaRecurso } from "@prisma/client";
import { projectValidation } from "@/project/project.validation";

class ResourseCategoryService {
  async createResourseCategory(
    data: I_CreateResourseCategoryBody,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Categoria del Recurso con el id del Proyecto proporcionado"
        );
      }
      const lastCategory = await resourseCategoryValidation.codeMoreHigh(
        project_id
      );
      const lastCategoryResponse = lastCategory.payload as CategoriaRecurso;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastCategoryResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");
      const resultIdResourseCategory =
        await resourseCategoryValidation.findByName(data.nombre, project_id);
      if (!resultIdResourseCategory.success) {
        return resultIdResourseCategory;
      }
      const resourceFormat = {
        ...data,
        codigo: formattedCodigo,
        proyecto_id: project_id,
      };

      const responseResourseCategory =
        await prismaResourseCategoryRepository.createResourseCategory(
          resourceFormat
        );
      const prouducResourseCategoryMapper = new ResourseCategoryMapper(
        responseResourseCategory
      );
      return httpResponse.CreatedResponse(
        "Categoria del recurso creado correctamente",
        prouducResourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Categoria del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [
        {
          codigo: "001",
          nombre: "Mano de Obra",
          proyecto_id: project_id,
        },
        {
          codigo: "002",
          nombre: "Materiales",
          proyecto_id: project_id,
        },
        {
          codigo: "003",
          nombre: "Equipos",
          proyecto_id: project_id,
        },
        {
          codigo: "004",
          nombre: "Sub-contratas",
          proyecto_id: project_id,
        },
        {
          codigo: "005",
          nombre: "Varios",
          proyecto_id: project_id,
        },
      ];

      const units =
        await prismaResourseCategoryRepository.createResourcesCategoryMasive(
          data
        );

      if (units.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear las Categorias de los Recursos"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva las Categorias de los Recursos"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva las Categorias de los Recursos",
        error
      );
    }
  }

  async updateResourseCategory(
    data: I_UpdateResourseCategoryBody,
    idResourseCategory: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdResourseCategory =
        await resourseCategoryValidation.findById(idResourseCategory);
      if (!resultIdResourseCategory.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id de la Categoria del Recurso que se quiere editar"
        );
      }
      const resourceCategoryFind =
        resultIdResourseCategory.payload as CategoriaRecurso;
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede actualizar la Categoria del Recurso con el id del Proyecto proporcionado"
        );
      }
      if (resourceCategoryFind.nombre != data.nombre) {
        const resultIdResourseCategory =
          await resourseCategoryValidation.findByName(data.nombre, project_id);
        if (!resultIdResourseCategory.success) {
          return resultIdResourseCategory;
        }
      }
      const resourceFormat = {
        ...data,
        proyecto_id: project_id,
      };

      const responseProductionUnit =
        await prismaResourseCategoryRepository.updateResourseCategory(
          resourceFormat,
          idResourseCategory
        );
      const resourseCategoryMapper = new ResourseCategoryMapper(
        responseProductionUnit
      );
      return httpResponse.SuccessResponse(
        "La Categoria del recurso fue modificada correctamente",
        resourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Categoria del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idResourseCategory: number): Promise<T_HttpResponse> {
    try {
      const resourseCategory = await prismaResourseCategoryRepository.findById(
        idResourseCategory
      );
      if (!resourseCategory) {
        return httpResponse.NotFoundException(
          "El id de la Categoria del Recurso no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "La Categoria del Recurso fue encontrada",
        resourseCategory
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result =
        await prismaResourseCategoryRepository.searchNameResourseCategory(
          name,
          skip,
          data.queryParams.limit
        );
      const { resoursesCategories, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: resoursesCategories,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar la Categoria del Recurso",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll, project_id: number) {
    try {
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede traer todas las categorias del recurso con el id del proyecto proporcionado"
        );
      }
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaResourseCategoryRepository.findAll(
        skip,
        data.queryParams.limit,
        project_id
      );

      const { categoriesResources, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: categoriesResources,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Categorias de los Recursos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas las Categorias de los Recursos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusProject(
    idResourseCategory: number
  ): Promise<T_HttpResponse> {
    try {
      const responseCategoryResponse =
        await resourseCategoryValidation.findById(idResourseCategory);
      if (!responseCategoryResponse.success) {
        return responseCategoryResponse;
      } else {
        const result =
          await prismaResourseCategoryRepository.updateStatusResourseCategory(
            idResourseCategory
          );
        return httpResponse.SuccessResponse(
          "Categoria del Recurso eliminada correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Categoria del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const resourseCategoryService = new ResourseCategoryService();
