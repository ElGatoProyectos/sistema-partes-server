import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaCompanyRepository } from "./prisma-company.repository";

class CompanyValidation {
  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaCompanyRepository.existsName(name);
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la empresa ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el nombre en la base de datos",
        error
      );
    }
  }
  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const company = await prismaCompanyRepository.findById(id);
      if (!company)
        return httpResponse.NotFoundException(
          "No se encontró la empresa solicitada"
        );
      return httpResponse.SuccessResponse(
        "Empresa encontrada con éxito",
        company
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar empresa",
        error
      );
    }
  }
}

export const companyValidation = new CompanyValidation();
