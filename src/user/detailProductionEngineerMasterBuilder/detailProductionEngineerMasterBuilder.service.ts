import { projectValidation } from "@/project/project.validation";
import { httpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "./prismaDetailProductionEngineerMasterBuilder.repository";

class DetailProductionEngineerMasterBuilderService {
  async findAll(data: T_FindAllDetailUserProject, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      //[message] id usuario harcodeado
      const user_id = 3;
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
        "Éxito al traer todos los Detalles de Capataz y Jefe Grupo",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Detalles de Capataz y Jefe Grupo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailProductionEngineerMasterBuilderService =
  new DetailProductionEngineerMasterBuilderService();
