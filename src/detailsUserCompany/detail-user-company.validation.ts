import { httpResponse, T_HttpResponse } from "@/common/http.response";
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
}

export const detailUserCompanyValidation = new DetailUserCompanyValidation();
