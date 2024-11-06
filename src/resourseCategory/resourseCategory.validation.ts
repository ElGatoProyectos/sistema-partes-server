import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaResourseCategoryRepository } from "./prisma-resourse-category.repository";

class ResourseCategoryValidation {
  async findById(idResourseCategory: number): Promise<T_HttpResponse> {
    try {
      const resourseCategory = await prismaResourseCategoryRepository.findById(
        idResourseCategory
      );
      if (!resourseCategory) {
        return httpResponse.NotFoundException(
          "Id de la Categoria del Recurso no encontrada"
        );
      }
      return httpResponse.SuccessResponse(
        "La Categoria del Recurso encontrada",
        resourseCategory
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria del Recurso ",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaResourseCategoryRepository.existsName(
        name,
        project_id
      );
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Categoria del recurso ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe de la Categoria del Recurso, puede proceguir",
        nameExists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la Categoria del recurso en la base de datos",
        error
      );
    }
  }
  async existsName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const resourceCategory =
        await prismaResourseCategoryRepository.findByName(name, project_id);
      if (!resourceCategory) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Categoria del recurso no existe"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre de la Categoria del Recurso existe, puede proceguir",
        resourceCategory
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la Categoria del Recurso en la Base de Datos",
        error
      );
    }
  }
  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaResourseCategoryRepository.codeMoreHigh(
        project_id
      );
      if (!unifiedIndex) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse(
        "Indice Unificado encontrado",
        unifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Indice Unificado",
        error
      );
    }
  }
}

export const resourseCategoryValidation = new ResourseCategoryValidation();
