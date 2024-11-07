import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaTypeWorkforceRepository } from "./prisma-typeWorkfoce.repository";
import { I_CreateTypeWorkforceBody } from "./models/typeWorkforce.interface";
import { typeWorkforceValidation } from "./typeWorkforce.validation";
import { projectValidation } from "../project/project.validation";
import prisma from "../config/prisma.config";
import { workforceValidation } from "../workforce/workforce.validation";
import { TipoObrero } from "@prisma/client";
import { T_FindAllType } from "./models/typeWorkforce.types";

class TypeWorkforceService {
  async createTypeWorkforce(
    data: I_CreateTypeWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const resultType = await typeWorkforceValidation.findByName(
        data.nombre,
        data.proyecto_id
      );
      if (resultType.success) {
        return httpResponse.BadRequestException(
          "El nombre ingresado del Tipo de Mano de Obra ya existe en la base de datos"
        );
      }
      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tipo de Mano de Obra con el id del Proyecto proporcionado"
        );
      }

      const responseType =
        await prismaTypeWorkforceRepository.createTypeWorkforce(data);
      return httpResponse.CreatedResponse(
        "Tipo de Mano de Obra creado correctamente",
        responseType
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Tipo de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateTypeWorkforce(
    type_id: number,
    data: I_CreateTypeWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const typeResponse = await typeWorkforceValidation.findById(type_id);
      if (!typeResponse.success) {
        return typeResponse;
      }
      const type = typeResponse.payload as TipoObrero;
      if (type.nombre != data.nombre) {
        const resultType = await typeWorkforceValidation.findByName(
          data.nombre,
          data.proyecto_id
        );
        if (resultType.success) {
          return httpResponse.BadRequestException(
            "El nombre ingresado del Tipo de Mano de Obra ya existe en la base de datos"
          );
        }
      }

      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tipo de Mano de Obra con el id del Proyecto proporcionado"
        );
      }

      const responseType =
        await prismaTypeWorkforceRepository.updateTypeWorkforce(type_id, data);
      return httpResponse.SuccessResponse(
        "Tipo de Mano de Obra actualizada correctamente",
        responseType
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el Tipo de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusTypeWorkforce(type_id: number): Promise<T_HttpResponse> {
    try {
      const resultType = await typeWorkforceValidation.findById(type_id);
      if (!resultType.success) {
        return resultType;
      }
      const resultIdWorkforce = await workforceValidation.findByIdType(type_id);
      if (resultIdWorkforce.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar el Tipo de Mano de Obra porque ya tiene una relación con una Mano de Obra"
        );
      }
      const responseType =
        await prismaTypeWorkforceRepository.updateStatusTypeWorkforce(type_id);
      return httpResponse.CreatedResponse(
        "Tipo de Mano de Obra eliminada correctamente",
        responseType
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Tipo de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(type_id: number): Promise<T_HttpResponse> {
    try {
      const typeResponse = await prismaTypeWorkforceRepository.findById(
        type_id
      );
      if (!typeResponse) {
        return httpResponse.NotFoundException(
          "El id del Tipo de Mano de Obra no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Tipo de Mano de Obra encontrada",
        typeResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tipo de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];
      data.push({ nombre: "Externo", proyecto_id: project_id });
      data.push({ nombre: "Obrero", proyecto_id: project_id });
      data.push({ nombre: "Staff", proyecto_id: project_id });

      const typeWorkforce =
        await prismaTypeWorkforceRepository.createTypeWorkforceMasive(data);

      if (typeWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Tipos de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva los Tipos de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva los Tipos de la Mano de Obra",
        error
      );
    }
  }
  async findAll(data: T_FindAllType, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaTypeWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { types, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: types,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Tipos de Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Tipos de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const typeWorkforceService = new TypeWorkforceService();
