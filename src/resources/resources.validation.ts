import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaResourcesRepository } from "./prisma-resources.repository";
import { I_ResourcesExcel } from "./models/resources.interface";
import { resourseCategoryValidation } from "../resourseCategory/resourseCategory.validation";
import {
  CategoriaRecurso,
  IndiceUnificado,
  Recurso,
  Unidad,
} from "@prisma/client";
import { unitValidation } from "../unit/unit.validation";
import { unifiedIndexValidation } from "../unifiedIndex/unifiedIndex.validation";

class ResourceValidation {
  async updateResource(
    data: I_ResourcesExcel,
    resource_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resourceCategoryResponse =
        await resourseCategoryValidation.existsName(
          data["NOMBRE DEL RECURSO"].trim(),
          project_id
        );
      const resourceCategory =
        resourceCategoryResponse.payload as CategoriaRecurso;
      const unitResponse = await unitValidation.findBySymbol(
        data.UNIDAD,
        project_id
      );
      const unit = unitResponse.payload as Unidad;
      const unifiedIndexResponse = await unifiedIndexValidation.findByName(
        data["NOMBRE INDICE UNIFICADO"].trim(),
        project_id
      );
      const unifiedIndex = unifiedIndexResponse.payload as IndiceUnificado;
      const lastResource = await resourceValidation.codeMoreHigh(project_id);
      const lastResourceFind = lastResource.payload as Recurso;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastResourceFind?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(4, "0");
      const resourceFormat = {
        codigo: formattedCodigo,
        nombre: data["NOMBRE DEL RECURSO"],
        precio: data.PRECIO ? parseInt(data.PRECIO) : 0,
        unidad_id: unit.id,
        proyecto_id: project_id,
        id_unificado: unifiedIndex.id,
        categoria_recurso_id: resourceCategory.id,
      };
      const resourceUpdate = await prismaResourcesRepository.updateResource(
        resourceFormat,
        resource_id
      );
      return httpResponse.SuccessResponse(
        "Recurso modificado correctamente",
        resourceUpdate
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Recurso",
        error
      );
    }
  }
  async findByCode(code: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.findByCode(
        code,
        project_id
      );
      if (resource) {
        return httpResponse.NotFoundException("Recurso encontrado", resource);
      }
      return httpResponse.SuccessResponse("Recurso no encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Recurso",
        error
      );
    }
  }
  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.findByCode(
        code,
        project_id
      );
      if (!resource) {
        return httpResponse.NotFoundException(
          "Recurso no encontrado",
          resource
        );
      }
      return httpResponse.SuccessResponse("Recurso encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Recurso",
        error
      );
    }
  }
  async findById(resource_id: number): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.findById(resource_id);
      if (!resource) {
        return httpResponse.NotFoundException("Id del Recurso no encontrado");
      }
      return httpResponse.SuccessResponse("Recurso encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Recurso",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.findByName(
        name,
        project_id
      );
      if (resource) {
        return httpResponse.NotFoundException(
          "El nombre del Recurso ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse("Recurso encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Recurso",
        error
      );
    }
  }
  async findByNameValidation(
    name: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.findByName(
        name,
        project_id
      );
      if (!resource) {
        return httpResponse.NotFoundException(
          "No se encontró el nombre del Recurso en la base de datos"
        );
      }
      return httpResponse.SuccessResponse("Recurso encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Recurso",
        error
      );
    }
  }

  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const resource = await prismaResourcesRepository.codeMoreHigh(project_id);
      if (!resource) {
        return httpResponse.SuccessResponse("No se encontraron resultados", 0);
      }
      return httpResponse.SuccessResponse("Recurso encontrado", resource);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Recurso",
        error
      );
    }
  }

  async findManyId(ids: number[], project_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartsResources = await prismaResourcesRepository.findManyId(
        ids,
        project_id
      );

      if (dailyPartsResources.length < ids.length) {
        return httpResponse.NotFoundException(
          "Un Recurso ingresado no existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "Los Recursos ingresados existen, pueden proceguir",
        dailyPartsResources
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Recursos Ingresados",
        error
      );
    }
  }
}

export const resourceValidation = new ResourceValidation();
