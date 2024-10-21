import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaOriginWorkforceRepository } from "./prisma-originWorkforce.repository";
import { I_CreateOriginWorkforceBody } from "./models/originWorkforce.interface";
import { originWorkforceValidation } from "./originWorkforce.validation";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { OrigenObrero } from "@prisma/client";
import { workforceValidation } from "@/workforce/workforce.validation";
import { T_FindAllOrigin } from "./models/originWorkforce.types";

class OriginWorkforceService {
  async createOriginWorkforce(
    data: I_CreateOriginWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const resultOrigin = await originWorkforceValidation.findByName(
        data.nombre,
        data.proyecto_id
      );
      if (resultOrigin.success) {
        return httpResponse.BadRequestException(
          "El nombre ingresado del Origen ya existe en la base de datos"
        );
      }
      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Origen con el id del Proyecto proporcionado"
        );
      }

      const responseOrigin =
        await prismaOriginWorkforceRepository.createOriginWorkforce(data);
      return httpResponse.CreatedResponse(
        "Origen creado correctamente",
        responseOrigin
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Origen",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateOriginWorkforce(
    origin_id: number,
    data: I_CreateOriginWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const originResponse = await originWorkforceValidation.findById(
        origin_id
      );
      if (!originResponse.success) {
        return originResponse;
      }
      const origin = originResponse.payload as OrigenObrero;
      if (origin.nombre != data.nombre) {
        const resultType = await originWorkforceValidation.findByName(
          data.nombre,
          data.proyecto_id
        );
        if (resultType.success) {
          return httpResponse.BadRequestException(
            "El Origen ingresado ya existe en la base de datos"
          );
        }
      }

      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Origen con el id del Proyecto proporcionado"
        );
      }

      const responseOrigin =
        await prismaOriginWorkforceRepository.updateOriginWorkforce(
          origin_id,
          data
        );
      return httpResponse.SuccessResponse(
        "Origen actualizada correctamente",
        responseOrigin
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el Origen",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusOriginWorkforce(
    origin_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultOrigin = await originWorkforceValidation.findById(origin_id);
      if (!resultOrigin.success) {
        return resultOrigin;
      }
      const resultIdWorkforce = await workforceValidation.findByIdOrigin(
        origin_id
      );
      if (resultIdWorkforce.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar el Origen porque ya tiene una relación con una Mano de Obra"
        );
      }
      const responseOrigin =
        await prismaOriginWorkforceRepository.updateStatusOriginWorkforce(
          origin_id
        );
      return httpResponse.CreatedResponse(
        "Origen eliminado correctamente",
        responseOrigin
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Origen",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(origin_id: number): Promise<T_HttpResponse> {
    try {
      const originResponse = await prismaOriginWorkforceRepository.findById(
        origin_id
      );
      if (!originResponse) {
        return httpResponse.NotFoundException(
          "El id del Origen no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse("Origen encontrada", originResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Origen",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];
      data.push({ nombre: "Apafa", proyecto_id: project_id });
      data.push({ nombre: "Casa", proyecto_id: project_id });
      data.push({ nombre: "Comunidad", proyecto_id: project_id });
      data.push({ nombre: "Externo", proyecto_id: project_id });
      data.push({ nombre: "Sindicato", proyecto_id: project_id });

      const originWorkforce =
        await prismaOriginWorkforceRepository.createOriginWorkforceMasive(data);

      if (originWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Origenes"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva los Origenes"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva los Origenes",
        error
      );
    }
  }
  async findAll(data: T_FindAllOrigin, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaOriginWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { origins, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: origins,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Origenes",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Origenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const originWorkforceService = new OriginWorkforceService();
