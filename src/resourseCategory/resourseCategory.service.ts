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

class ResourseCategoryService {
  async createResourseCategory(
    data: I_CreateResourseCategoryBody
  ): Promise<T_HttpResponse> {
    try {
      const resultIdResourseCategory =
        await resourseCategoryValidation.findByName(data.nombre);
      if (!resultIdResourseCategory.success) {
        return resultIdResourseCategory;
      }

      const responseResourseCategory =
        await prismaResourseCategoryRepository.createResourseCategory(data);
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

  async updateResourseCategory(
    data: I_UpdateResourseCategoryBody,
    idResourseCategory: number
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

      if (resourceCategoryFind.nombre != data.nombre) {
        const resultIdResourseCategory =
          await resourseCategoryValidation.findByName(data.nombre);
        if (!resultIdResourseCategory.success) {
          return resultIdResourseCategory;
        }
      }

      const responseProductionUnit =
        await prismaResourseCategoryRepository.updateResourseCategory(
          data,
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

  async findAll(data: T_FindAll) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaResourseCategoryRepository.findAll(
        skip,
        data.queryParams.limit
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
