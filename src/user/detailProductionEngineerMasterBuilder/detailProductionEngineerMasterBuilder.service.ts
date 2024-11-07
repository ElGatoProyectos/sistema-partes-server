import { projectValidation } from "../../project/project.validation";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "./prismaDetailProductionEngineerMasterBuilder.repository";
import { detailDetailProductionEngineerMasterBuilderValidation } from "./detailProductionEngineerMasterBuilder.validation";
import { DetalleMaestroObraCapataz } from "@prisma/client";

class DetailProductionEngineerMasterBuilderService {
  async findAll(
    data: T_FindAllDetailUserProject,
    project_id: string,
    user_id: number
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result =
        await prismaDetailProductionEngineerMasterBuilderRepository.getAllDetailProductionEngineerMasterBuilder(
          skip,
          data,
          +project_id,
          user_id
        );

      const { userAll, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: userAll,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Detalles de Ingeniero de Producción y Maestro de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Detalles de Ingeniero de Producción y Maestro de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async deleteDetail(
    master_builder_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detailResponse =
        await detailDetailProductionEngineerMasterBuilderValidation.findByIdMasterBuilder(
          master_builder_id,
          project_id
        );
      if (!detailResponse.success) {
        return detailResponse;
      }
      const detailProductionEngineerMasterBuilder =
        detailResponse.payload as DetalleMaestroObraCapataz;
      await prismaDetailProductionEngineerMasterBuilderRepository.deleteDetail(
        detailProductionEngineerMasterBuilder.id
      );
      return httpResponse.SuccessResponse(
        "Detalle Ingeniero de Producción y Maestro de Obra eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Detalle Ingeniero de Producción y Maestro de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailProductionEngineerMasterBuilderService =
  new DetailProductionEngineerMasterBuilderService();
