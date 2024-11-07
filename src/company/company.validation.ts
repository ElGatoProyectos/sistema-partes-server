import { userValidation } from "../user/user.validation";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateCompanyAdminBody } from "./models/company.interface";
import { prismaCompanyRepository } from "./prisma-company.repository";
import { Usuario } from "@prisma/client";
import { CompanyResponseMapper } from "./mapper/company.mapper";

class CompanyValidation {
  async findByEmail(email: string): Promise<T_HttpResponse> {
    try {
      const emailExists = await prismaCompanyRepository.existsEmail(email);
      if (emailExists) {
        return httpResponse.NotFoundException(
          "El correo ingresado de la empresa ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proseguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el nombre en la base de datos",
        error
      );
    }
  }
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
        "Error al buscar el nombre en la base de datos",
        error
      );
    }
  }

  async findByNameShort(name: string): Promise<T_HttpResponse> {
    try {
      const nameShort = await prismaCompanyRepository.existsNameShort(name);
      if (nameShort) {
        return httpResponse.NotFoundException(
          "El nombre corto ingresado de la empresa ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre corto no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el nombre corto en la base de datos",
        error
      );
    }
  }

  async findByRuc(ruc: string): Promise<T_HttpResponse> {
    try {
      const rucExists = await prismaCompanyRepository.existsRuc(ruc);
      if (rucExists) {
        return httpResponse.NotFoundException(
          "El Ruc ingresado de la empresa ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse("El Ruc no existe, puede proceguir");
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el ruc en la base de datos",
        error
      );
    }
  }

  async findByIdUser(id: number): Promise<T_HttpResponse> {
    try {
      const company = await prismaCompanyRepository.findByIdUser(id);
      if (!company)
        return httpResponse.NotFoundException(
          "No se encontró la empresa del Usuario"
        );
      return httpResponse.SuccessResponse(
        "Empresa del Usuario encontrada con éxito",
        company
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar empresa",
        error
      );
    }
  }
  async findByUserForCompany(user_id: number): Promise<T_HttpResponse> {
    try {
      const company = await prismaCompanyRepository.findCompanyByUser(user_id);
      if (!company)
        return httpResponse.NotFoundException(
          "No se encontró la empresa del Usuario"
        );
      return httpResponse.SuccessResponse(
        "Empresa del Usuario encontrada con éxito",
        company
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar empresa",
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
        "Error al buscar empresa",
        error
      );
    }
  }
  async createCompanyOfTheAdmin(
    data: I_CreateCompanyAdminBody
  ): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findByEmailAdmin(
        "ale@gmail.com"
      );
      if (!userResponse.success) {
        return userResponse;
      }

      const user = userResponse.payload as Usuario;
      const companyFormat = {
        ...data,
        usuario_id: user.id,
      };
      const result = await prismaCompanyRepository.createCompany(companyFormat);

      const companyMapper = new CompanyResponseMapper(result);
      return httpResponse.CreatedResponse(
        "Empresa creada correctamente",
        companyMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear empresa",
        error
      );
    }
  }
}

export const companyValidation = new CompanyValidation();
