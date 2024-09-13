import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaUnifiedIndexRepository } from "./prisma-unified-index";

class UnifiedIndexValidation {
  async findById(idUnifiedIndex: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.findById(
        idUnifiedIndex
      );
      if (!unifiedIndex) {
        return httpResponse.NotFoundException(
          "Id del Indice Unificado no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "El Indice Unificado fue encontrado",
        unifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Indice Unificado",
        error
      );
    }
  }

  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaUnifiedIndexRepository.existsName(name);
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado del Indice Unificado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Indice Unificado en la base de datos",
        error
      );
    }
  }
  async findBySymbol(symbol: string): Promise<T_HttpResponse> {
    try {
      const symbolExists = await prismaUnifiedIndexRepository.existSymbol(symbol);
      if (symbolExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado del Indice Unificado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Indice Unificado en la base de datos",
        error
      );
    }
  }
}

export const unifiedIndexValidation = new UnifiedIndexValidation();
