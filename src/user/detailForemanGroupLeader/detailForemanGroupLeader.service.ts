import { projectValidation } from "../../project/project.validation";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { prismaDetailForemanGroupLeaderRepository } from "./prisma-detailForemanGroupLeader.respository";
import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";
import { detailForemanGroupLeaderValidation } from "./detailForemanGroupLeader.validation";
import { DetalleCapatazJefeGrupo } from "@prisma/client";

class DetailForemanGroupLeaderService {
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
        await prismaDetailForemanGroupLeaderRepository.getAllDetailForemanGroupLeader(
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
  async deleteDetail(
    group_leader_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detailResponse =
        await detailForemanGroupLeaderValidation.findByIdGroupLeader(
          group_leader_id,
          project_id
        );
      if (!detailResponse.success) {
        return detailResponse;
      }
      const detailForemanGroupLeader =
        detailResponse.payload as DetalleCapatazJefeGrupo;
      await prismaDetailForemanGroupLeaderRepository.deleteDetail(
        detailForemanGroupLeader.id
      );
      return httpResponse.SuccessResponse(
        "Detalle Capataz-Jefe de Grupo eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Detalle Capataz-Jefe de Grupo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailForemanGroupLeaderService =
  new DetailForemanGroupLeaderService();
