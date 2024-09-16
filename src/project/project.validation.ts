import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaProyectoRepository } from "./prisma-project.repository";

class ProjectValidation {
  async findById(idProject: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProyectoRepository.findById(idProject);
      if (!project) {
        return httpResponse.NotFoundException("Id del proyecto no encontrado");
      }
      return httpResponse.SuccessResponse("Proyecto encontrado", project);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
        error
      );
    }
  }
}

export const projectValidation = new ProjectValidation();
