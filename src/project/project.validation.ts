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
  async findByIdValidation(idProject: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProyectoRepository.findByIdValidation(idProject);
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
  async findByIdUserInDetail(user_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaProyectoRepository.findByIdInDetailProyecto(user_id);
      if (!detail) {
        return httpResponse.NotFoundException("Id del usuario no encontrado en el Detalle Usuario Proyecto");
      }
      return httpResponse.SuccessResponse("Id del usuario encontrado en el Detalle Usuario Proyecto", detail);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el id del usuario encontrado en el Detalle Usuario Proyecto",
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
  async totalProjectsByCompany(company_id: number): Promise<T_HttpResponse> {
    try {
      const totalResponse =
        await prismaProyectoRepository.totalProjectsByCompany(company_id);
      return httpResponse.SuccessResponse("Empresa encontrada", totalResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar por la Empresa",
        error
      );
    }
  }
  async findAllWithOutPagination(): Promise<T_HttpResponse> {
    try {
      const total =
        await prismaProyectoRepository.findAllWithOutPagination();
      return httpResponse.SuccessResponse("Éxito al traer todos los Proyectos", total);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar todos los Proyetos",
        error
      );
    }
  }
}

export const projectValidation = new ProjectValidation();
