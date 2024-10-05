import { companyValidation } from "@/company/company.validation";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { T_FindAllDetailUserCompany } from "./models/detailsUserCompany.types";
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
  async findAllUnassigned(
    data: T_FindAllDetailUserCompany,
    company_id: string
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const companyResponse = await companyValidation.findById(+company_id);
      if (!companyResponse.success) {
        return companyResponse;
      }
      const result =
        await prismaDetailUserCompanyRepository.getAllUsersOfProjectUnassigned(
          skip,
          data,
          +company_id
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
        "Éxito al traer todos los Usuarios de la Empresa con Rol Sin Asignar",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Usuarios de la Empresa con Rol Sin Asignar",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const detailUserCompanyService = new DetailUserCompanyService();
