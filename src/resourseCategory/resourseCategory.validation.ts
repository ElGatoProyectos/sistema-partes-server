import { httpResponse, T_HttpResponse } from "@/common/http.response";
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
  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaResourseCategoryRepository.existsName(
        name
      );
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Categoria del recurso ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la Categoria del recurso en la base de datos",
        error
      );
    }
  }
}

export const resourseCategoryValidation = new ResourseCategoryValidation();
