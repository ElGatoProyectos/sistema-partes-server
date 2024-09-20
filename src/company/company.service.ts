import { httpResponse, T_HttpResponse } from "../common/http.response";
import { T_FindAll } from "../common/models/pagination.types";
import { prismaCompanyRepository } from "./prisma-company.repository";
import prisma from "../config/prisma.config";
import {
  I_CreateCompanyAdminBody,
  I_CreateCompanyBody,
  I_UpdateCompanyBody,
} from "./models/company.interface";
import { CompanyResponseMapper } from "./mapper/company.mapper";
import { CompanyMulterProperties } from "./models/company.constant";
import appRootPath from "app-root-path";
import fs from "fs/promises";
import { wordIsNumeric } from "../common/utils/number";
import { largeMinEleven } from "../common/utils/largeMinEleven";
import { userValidation } from "../user/user.validation";
import { companyValidation } from "./company.validation";
import { Empresa, Usuario } from "@prisma/client";
import { emailValid } from "../common/utils/email";
import { userService } from "../user/user.service";
import { jwtService } from "../auth/jwt.service";
import { Console } from "console";

class CompanyService {
  async createCompany(data: I_CreateCompanyBody): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(
        Number(data.usuario_id)
      );
      if (!userResponse.success) {
        return userResponse;
      }

      const responseName = await companyValidation.findByName(
        data.nombre_empresa
      );
      if (!responseName.success) return responseName;

      const responseNameShort = await companyValidation.findByNameShort(
        data.nombre_empresa
      );
      if (!responseNameShort.success) return responseNameShort;

      const responseRuc = await companyValidation.findByRuc(
        data.nombre_empresa
      );
      if (!responseRuc.success) return responseRuc;

      if (data.ruc) {
        const resultRuc = wordIsNumeric(data.ruc);
        if (resultRuc) {
          return httpResponse.BadRequestException(
            "El campo Ruc debe contener solo números"
          );
        }
        const resultRucLength = largeMinEleven(data.ruc);
        if (resultRucLength) {
          return httpResponse.BadRequestException(
            "El campo Ruc debe contener por lo menos 11 caracteres"
          );
        }
      }

      const resultPhoneCompany = wordIsNumeric(data.telefono);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      const resultEmail = emailValid(data.correo);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }

      const responseEmail = await companyValidation.findByEmail(data.correo);
      if (!responseEmail.success) return responseEmail;

      const companyFormat = {
        ...data,
        usuario_id: Number(data.usuario_id),
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
    } finally {
      await prisma.$disconnect();
    }
  }
  async createCompanyWithTokenUser(
    data: I_CreateCompanyBody,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse.success) {
        return userTokenResponse;
      }
      const userResponse = userTokenResponse.payload as Usuario;

      const responseName = await companyValidation.findByName(
        data.nombre_empresa
      );
      if (!responseName.success) return responseName;

      const responseNameShort = await companyValidation.findByNameShort(
        data.nombre_empresa
      );
      if (!responseNameShort.success) return responseNameShort;

      const responseRuc = await companyValidation.findByRuc(
        data.nombre_empresa
      );
      if (!responseRuc.success) return responseRuc;

      if (data.ruc) {
        const resultRuc = wordIsNumeric(data.ruc);
        if (resultRuc) {
          return httpResponse.BadRequestException(
            "El campo Ruc debe contener solo números"
          );
        }
        const resultRucLength = largeMinEleven(data.ruc);
        if (resultRucLength) {
          return httpResponse.BadRequestException(
            "El campo Ruc debe contener por lo menos 11 caracteres"
          );
        }
      }

      const resultPhoneCompany = wordIsNumeric(data.telefono);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      const resultEmail = emailValid(data.correo);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }

      const responseEmail = await companyValidation.findByEmail(data.correo);
      if (!responseEmail.success) return responseEmail;
      const companyFormat = {
        ...data,
        usuario_id: userResponse.id,
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
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaCompanyRepository.findAll(
        skip,
        data.queryParams.limit
      );

      const { companies, total } = result;
      //numero de pagina donde estas
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: companies,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las empresas",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer las empresas",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findIdImage(idProject: number) {
    try {
      const productionUnitResponse = await prismaCompanyRepository.findById(
        idProject
      );
      if (!productionUnitResponse)
        return httpResponse.NotFoundException(
          "No se ha podido encontrar la imagen de la empresa"
        );

      const imagePath =
        appRootPath +
        "/static/" +
        CompanyMulterProperties.folder +
        "/" +
        CompanyMulterProperties.folder +
        "_" +
        productionUnitResponse.id +
        ".png";

      try {
        // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return httpResponse.BadRequestException(" La Imagen no fue encontrada");
      }

      return httpResponse.SuccessResponse("Imagen encontrada", imagePath);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la imagen",
        error
      );
    } finally {
      await prisma.$disconnect;
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
    } finally {
      await prisma.$disconnect();
    }
  }

  async findCompanyByUser(idUser: number) {
    try {
      const company = await prismaCompanyRepository.findCompanyByUser(idUser);
      if (!company)
        return httpResponse.NotFoundException(
          "No se encontró la empresa del usuario"
        );
      return httpResponse.SuccessResponse(
        "Empresa encontrada del usuario con éxito",
        company
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar empresa del usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateCompany(
    data: I_UpdateCompanyBody,
    idCompany: number
  ): Promise<T_HttpResponse> {
    try {
      const companyResponseId = await companyValidation.findById(idCompany);
      if (!companyResponseId.success) return companyResponseId;

      const userResponse = await userValidation.findById(
        Number(data.usuario_id)
      );
      if (!userResponse.success) return userResponse;

      const company = companyResponseId.payload as Empresa;

      if (company.nombre_empresa != data.nombre_empresa) {
        const responseName = await companyValidation.findByName(
          data.nombre_empresa
        );
        if (!responseName.success) return responseName;
      }

      if (company.nombre_corto != data.nombre_corto) {
        const responseNameShort = await companyValidation.findByNameShort(
          data.nombre_empresa
        );
        if (!responseNameShort.success) return responseNameShort;
      }

      if (company.ruc != data.ruc) {
        const responseRuc = await companyValidation.findByRuc(
          data.nombre_empresa
        );
        if (!responseRuc.success) return responseRuc;
      }

      const resultPhoneCompany = wordIsNumeric(data.telefono);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      const resultEmail = emailValid(data.correo);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }

      if (company.correo != data.correo) {
        const responseEmail = await companyValidation.findByEmail(data.correo);
        if (!responseEmail.success) return responseEmail;
      }

      const companyFormat = {
        ...data,
        usuario_id: Number(data.usuario_id),
      };
      const companyResponse = await prismaCompanyRepository.updateCompany(
        companyFormat,
        idCompany
      );
      const companyMapper = new CompanyResponseMapper(companyResponse);
      return httpResponse.CreatedResponse(
        "Empresa modificada correctamente",
        companyMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar la empresa",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateCompanyWithTokenUser(
    data: I_UpdateCompanyBody,
    idCompany: number,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const companyResponseId = await companyValidation.findById(idCompany);

      if (!companyResponseId.success) return companyResponseId;

      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse.success) {
        return userTokenResponse;
      }
      const userResponse = userTokenResponse.payload as Usuario;

      const company = companyResponseId.payload as Empresa;

      if (company.nombre_empresa != data.nombre_empresa) {
        const responseName = await companyValidation.findByName(
          data.nombre_empresa
        );
        if (!responseName.success) return responseName;
      }

      if (company.nombre_corto != data.nombre_corto) {
        const responseNameShort = await companyValidation.findByNameShort(
          data.nombre_empresa
        );
        if (!responseNameShort.success) return responseNameShort;
      }

      if (company.ruc != data.ruc) {
        const responseRuc = await companyValidation.findByRuc(
          data.nombre_empresa
        );
        if (!responseRuc.success) return responseRuc;
      }

      const resultPhoneCompany = wordIsNumeric(data.telefono);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      const resultEmail = emailValid(data.correo);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }

      if (company.correo != data.correo) {
        const responseEmail = await companyValidation.findByEmail(data.correo);
        if (!responseEmail.success) return responseEmail;
      }

      const companyFormat = {
        ...data,
        usuario_id: userResponse.id,
      };
      const companyResponse = await prismaCompanyRepository.updateCompany(
        companyFormat,
        idCompany
      );
      const companyMapper = new CompanyResponseMapper(companyResponse);
      return httpResponse.CreatedResponse(
        "Empresa modificada correctamente",
        companyMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar la empresa",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusCompany(idCompany: number): Promise<T_HttpResponse> {
    try {
      const companyResponse = await companyValidation.findById(idCompany);
      if (!companyResponse.success) return companyResponse;
      const empresaResponse = await prismaCompanyRepository.updateStatusCompany(
        idCompany
      );
      return httpResponse.SuccessResponse(
        "Empresa eliminada correctamente",
        empresaResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la empresa",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async searchByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaCompanyRepository.searchNameCompany(
        name,
        skip,
        data.queryParams.limit
      );
      const { companies, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: companies,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar las empresas",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar empresas",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const companyService = new CompanyService();
