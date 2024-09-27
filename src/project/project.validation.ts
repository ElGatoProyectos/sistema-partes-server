import { httpResponse, T_HttpResponse } from "../common/http.response";
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
  async codeMoreHigh(company_id: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProyectoRepository.codeMoreHigh(company_id);
      if (!project) {
        return httpResponse.SuccessResponse("No se encontraron resultados", 0);
      }
      return httpResponse.SuccessResponse("Proyecto encontrado", project);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Proyecto",
        error
      );
    }
  }
}

export const projectValidation = new ProjectValidation();
