import { projectValidation } from "../../project/project.validation";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";
import { prismaDetailMasterBuilderForemanRepository } from "./prismaDetailMasterBuilderForeman.repository";
import { detailMasterBuilderForemanValidation } from "./detailMasterBuilderForeman.validation";
import { DetalleMaestroObraCapataz } from "@prisma/client";

class DetailMasterBuilderForemanService {
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
        await prismaDetailMasterBuilderForemanRepository.getAllDetailMasterBuilderForeman(
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
        "Éxito al traer todos los Detalles de Maestro de Obra y Capataz",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Detalles de Maestro de Obra y Capataz",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async deleteDetail(
    foreman_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detailResponse =
        await detailMasterBuilderForemanValidation.findByIdForeman(
          foreman_id,
          project_id
        );
      if (!detailResponse.success) {
        return detailResponse;
      }
      const detailMasterBuilderForeman =
        detailResponse.payload as DetalleMaestroObraCapataz;
      await prismaDetailMasterBuilderForemanRepository.deleteDetail(
        detailMasterBuilderForeman.id
      );
      return httpResponse.SuccessResponse(
        "Detalle Maestro de Obra y Capataz eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Maestro de Obra y Capataz",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailMasterBuilderForemanService =
  new DetailMasterBuilderForemanService();
