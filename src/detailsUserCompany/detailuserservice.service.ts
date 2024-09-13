import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaDetailUserCompanyRepository } from "./prismaUserDetailCompany.respository";
import prisma from "@/config/prisma.config";

class DetailUserCompanyService {
  async createDetail(
    idUser: number,
    idCompany: number
  ): Promise<T_HttpResponse> {
    try {
      const responseDetails =
        await prismaDetailUserCompanyRepository.createCompany(
          idUser,
          idCompany
        );
      return httpResponse.CreatedResponse(
        "Detalle usuario-empresa creado correctamente",
        responseDetails
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear detalle usuario-empresa",
        error
      );
    }
  }
}
export const detailUserCompanyService = new DetailUserCompanyService();
