import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaUnitRepository } from "./prisma-unit.repository";

class UnitValidation {
  async findById(idResourseCategory: number): Promise<T_HttpResponse> {
    try {
      const unitResponse = await prismaUnitRepository.findById(
        idResourseCategory
      );
      if (!unitResponse) {
        return httpResponse.NotFoundException(
          "Id de la Unidad no fue encontrada"
        );
      }
      return httpResponse.SuccessResponse(
        "La Unidad fue encontrada",
        unitResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad ",
        error
      );
    }
  }
  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaUnitRepository.existsName(name);
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Unidad ya existe en la base de datos"
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
  async findBySymbol(symbol: string): Promise<T_HttpResponse> {
    try {
      const symbolExists = await prismaUnitRepository.existsSymbol(symbol);
      if (symbolExists) {
        return httpResponse.NotFoundException(
          "El simbolo ingresado de la Unidad ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El simbolo no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el simbolo de la Unidad en la base de datos",
        error
      );
    }
  }
}

export const unitValidation = new UnitValidation();