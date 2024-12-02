import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaDetailUserCompanyRepository } from "./prismaUserDetailCompany.respository";

class DetailUserCompanyValidation {
  async findByIdCompany(company_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailUserCompanyRepository.findByIdCompany(
        company_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Detalle Usuario-Empresa de la empresa proporcionada no encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Usuario-Empresa encontrado de la empresa proporcionada",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Usuario-Empresa ",
        error
      );
    }
  }
  async findByIdUser(user_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailUserCompanyRepository.findByIdUser(
        user_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Detalle Usuario-Empresa de la empresa proporcionada no encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Usuario-Empresa encontrado de la empresa proporcionada",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Usuario-Empresa ",
        error
      );
    }
  }
  async findAllByIdCompany(company_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailUserCompanyRepository.findAllByIdCompanyWithOutPagination(
        company_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Detalle Usuario-Empresa de la empresa proporcionada no encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Usuario-Empresa encontrado de la empresa proporcionada",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Detalle Usuario-Empresa ",
        error
      );
    }
  }
  async totalUserByCompany(company_id: number): Promise<T_HttpResponse> {
    try {
      const countUsersByCompany =
        await prismaDetailUserCompanyRepository.countUsersForCompany(
          company_id
        );
      if (!countUsersByCompany) {
        return httpResponse.NotFoundException(
          "La empresa proporcionada para buscar sus usuarios no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Se encontró la cantidad de usuarios de la empresa",
        countUsersByCompany
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la cantidad de usuarios de la empresa",
        error
      );
    }
  }
}

export const detailUserCompanyValidation = new DetailUserCompanyValidation();
