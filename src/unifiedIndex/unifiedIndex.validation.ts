import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaUnifiedIndexRepository } from "./prisma-unified-index";
import { I_UnifiedIndexExcel } from "./models/unifiedIndex.interface";

class UnifiedIndexValidation {
  async updateUnifiedIndex(
    data: I_UnifiedIndexExcel,
    idUnit: number,
    idCompany: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const unifiedIndexFormat = {
        codigo: String(data.ID),
        nombre: data.Nombre,
        simbolo: data.Simbolo,
        comentario: data.Comentario,
        empresa_id: idCompany,
        proyect_id: project_id,
      };

      const responseUnifiedIndex =
        await prismaUnifiedIndexRepository.updateUnifiedIndex(
          unifiedIndexFormat,
          idUnit
        );
      return httpResponse.SuccessResponse(
        "Indice Unificado modificado correctamente",
        responseUnifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Indice Unificado",
        error
      );
    }
  }
  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.codeMoreHigh(
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
  async findByCode(code: string): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.findByCode(code);
      if (unifiedIndex) {
        return httpResponse.NotFoundException(
          "El códgo del Indice Unificado encontrado",
          unifiedIndex
        );
      }
      return httpResponse.SuccessResponse(
        "El códgo del Indice Unificado fue encontrado",
        unifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el códgo del Indice Unificado",
        error
      );
    }
  }
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

  async findByName(name: string, project_id_: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.existsName(
        name,
        project_id_
      );
      if (!unifiedIndex) {
        return httpResponse.NotFoundException(
          "El nombre ingresado del Indice Unificado no existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre del Indice Unificado existe, puede proceguir",
        unifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Indice Unificado en la base de datos",
        error
      );
    }
  }
  async findByNameValidation(
    name: string,
    project_id_: number
  ): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaUnifiedIndexRepository.existsName(
        name,
        project_id_
      );
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado del Indice Unificado existe en la base de datos"
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
  async findBySymbol(
    symbol: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const symbolExists = await prismaUnifiedIndexRepository.existSymbol(
        symbol,
        project_id
      );
      if (symbolExists) {
        return httpResponse.NotFoundException(
          "El Simbolo ingresado del Indice Unificado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El Simbolo no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Simbolo del Indice Unificado en la base de datos",
        error
      );
    }
  }
}

export const unifiedIndexValidation = new UnifiedIndexValidation();
