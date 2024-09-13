import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateUnifiedIndexBody,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { unifiedIndexValidation } from "./unifiedIndex.validation";
import { prismaUnifiedIndexRepository } from "./prisma-unified-index";
import { UnifiedIndexResponseMapper } from "./mapper/unifiedIndex.mapper";
import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import { companyValidation } from "@/company/company.validation";
import { IndiceUnificado } from "@prisma/client";

class UnifiedIndexService {
  async createUnifiedIndex(
    data: I_CreateUnifiedIndexBody
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await unifiedIndexValidation.findByName(
        data.nombre
      );
      if (!resultIdProject.success) {
        return resultIdProject;
      }

      const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
        data.simbolo
      );
      if (!resultIdUnifiedIndex.success) {
        return resultIdUnifiedIndex;
      }

      const resultIdCompany = await companyValidation.findById(data.empresa_id);
      if (!resultIdCompany.success) {
        return resultIdCompany;
      }

      const unifiedIndexFormat = {
        ...data,
        simbolo: data.simbolo.toUpperCase(),
      };
      const responseUnifiedIndex =
        await prismaUnifiedIndexRepository.createUnifiedIndex(
          unifiedIndexFormat
        );
      const prouducResourseCategoryMapper = new UnifiedIndexResponseMapper(
        responseUnifiedIndex
      );
      return httpResponse.CreatedResponse(
        "Indice Unificado creado correctamente",
        prouducResourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateUnifiedIndex(
    data: I_UpdateUnifiedIndexBody,
    idUnifiedIndex: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdResourseCategory = await unifiedIndexValidation.findById(
        idUnifiedIndex
      );
      const unifiedIndexFind =
        resultIdResourseCategory.payload as IndiceUnificado;
      if (!resultIdResourseCategory.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Indice Unificado que se quiere editar"
        );
      }

      if (unifiedIndexFind.nombre != data.nombre) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findByName(
          data.nombre
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      if (unifiedIndexFind.simbolo != data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      const resultIdCompany = await companyValidation.findById(data.empresa_id);
      if (!resultIdCompany.success) {
        return httpResponse.BadRequestException(
          "No se encontró el id de la Empresa para crear el indice unificado"
        );
      }
      const unifiedIndexFormat = {
        ...data,
        simbolo: data.simbolo.toUpperCase(),
      };
      const responseUnifiedIndex =
        await prismaUnifiedIndexRepository.updateUnifiedIndex(
          unifiedIndexFormat,
          idUnifiedIndex
        );
      const resourseCategoryMapper = new UnifiedIndexResponseMapper(
        responseUnifiedIndex
      );
      return httpResponse.SuccessResponse(
        "El Indice Unificado fue modificado correctamente",
        resourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idUnifiedIndex: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.findById(
        idUnifiedIndex
      );
      if (!unifiedIndex) {
        return httpResponse.NotFoundException(
          "El id del Indice Unificado no fue encontrado"
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
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.searchNameUnifiedIndex(
        name,
        skip,
        data.queryParams.limit
      );

      const { unifiedIndex, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: unifiedIndex,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar Indices Unificados",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Indices Unificados",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.findAll(
        skip,
        data.queryParams.limit
      );

      const { unifiedIndex, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: unifiedIndex,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas los Indices Unificados",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Indices Unificados",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUnifiedIndex(
    idUnifiedIndex: number
  ): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await unifiedIndexValidation.findById(
        idUnifiedIndex
      );
      if (!unifiedIndex.success) {
        return unifiedIndex;
      } else {
        const result =
          await prismaUnifiedIndexRepository.updateStatusUnifiedIndex(
            idUnifiedIndex
          );
        return httpResponse.SuccessResponse(
          "Indice Unificado eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const unifiedIndexService = new UnifiedIndexService();
