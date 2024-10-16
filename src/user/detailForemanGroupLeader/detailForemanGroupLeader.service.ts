import { projectValidation } from "@/project/project.validation";
import { T_FindAllDetailForemanGroupLeader } from "./models/detailForemanGroupLeader.types";
import { httpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaDetailForemanGroupLeaderRepository } from "./prisma-detailForemanGroupLeader.respository";

class DetailForemanGroupLeaderService {
  async findAll(data: T_FindAllDetailForemanGroupLeader, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result =
        await prismaDetailForemanGroupLeaderRepository.getAllDetailForemanGroupLeader(
          skip,
          data,
          +project_id
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
        "Error al traer todas los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailForemanGroupLeaderService =
  new DetailForemanGroupLeaderService();
