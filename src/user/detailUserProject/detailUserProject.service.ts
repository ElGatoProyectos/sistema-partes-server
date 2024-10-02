import { projectValidation } from "@/project/project.validation";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import { prismaDetailUserProjectRepository } from "./prismaUserProject.repository";
import { httpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";

class DetailUserProjectService {
  async findAll(data: T_FindAllDetailUserProject, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result =
        await prismaDetailUserProjectRepository.getAllUsersOfProject(
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
        "Éxito al traer todos los Usuarios del Proyecto",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Usuarios del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailUserProjectService = new DetailUserProjectService();
