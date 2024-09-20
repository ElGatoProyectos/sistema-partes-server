import express from "@/config/express.config";
import {
  I_CreateCompanyBody,
  I_UpdateCompanyBody,
} from "./models/company.interface";
import { companyService } from "./company.service";
import { T_FindAll } from "@/common/models/pagination.types";
import { httpResponse } from "@/common/http.response";
import { CompanyMulterProperties } from "./models/company.constant";
import { authService } from "@/auth/auth.service";
import { empresaDto } from "./dto/companydto";
import multer from "multer";
import { Empresa } from "@prisma/client";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import { empresaUpdateDto } from "./dto/companyupdatedto";
import { productionUnitService } from "@/production-unit/production-unit.service";
import fs from "fs/promises";
import validator from "validator";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class CompanyController {
  create = async (request: express.Request, response: express.Response) => {
    upload.single(CompanyMulterProperties.field)(
      request,
      response,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen ",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              empresaDto.parse(request.body);
              const tokenWithBearer = request.headers.authorization;
              if (tokenWithBearer) {
                const data = request.body as I_CreateCompanyBody;
                const result = await companyService.createCompanyWithTokenUser(
                  data,
                  tokenWithBearer
                );
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as Empresa;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      CompanyMulterProperties.folder
                    );
                    const ext = ".png";
                    const fileName = `${CompanyMulterProperties.folder}_${id}${ext}`;
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la foto de la empresa",
                            err
                          );
                          response
                            .status(customError.statusCode)
                            .json(customError);
                        } else {
                          response.status(result.statusCode).json(result);
                        }
                      });
                  } else {
                    response.status(result.statusCode).json(result);
                  }
                }
              } else {
                const result = httpResponse.UnauthorizedException(
                  "Error en la autenticacion al crear el usuario"
                );
                response.status(result.statusCode).json(result);
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "Error al validar los campos de la empresa ",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  update = async (request: express.Request, response: express.Response) => {
    upload.single(CompanyMulterProperties.field)(
      request,
      response,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen ",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              empresaUpdateDto.parse(request.body);
              const tokenWithBearer = request.headers.authorization;
              const data = request.body as I_UpdateCompanyBody;
              const company_id = request.params.id;
              if (!validator.isNumeric(company_id)) {
                const customError = httpResponse.BadRequestException(
                  "El id del projecto debe ser numérico",
                  error
                );
                response.status(customError.statusCode).json(customError);
              } else {
                if (tokenWithBearer) {
                  const result =
                    await companyService.updateCompanyWithTokenUser(
                      data,
                      +company_id,
                      tokenWithBearer
                    );

                  if (!result.success) {
                    response.status(result.statusCode).json(result);
                  } else {
                    const project = result.payload as Empresa;
                    if (request.file) {
                      const id = project.id;
                      const direction = path.join(
                        appRootPath.path,
                        "static",
                        CompanyMulterProperties.folder
                      );
                      const ext = ".png";
                      const fileName = `${CompanyMulterProperties.folder}_${id}${ext}`;
                      const filePath = path.join(direction, fileName);
                      sharp(request.file.buffer)
                        .resize({ width: 800 })
                        .toFormat("png")
                        .toFile(filePath, (err) => {
                          if (err) {
                            const customError =
                              httpResponse.BadRequestException(
                                "Error al actualizar la imagen de la empresa",
                                err
                              );
                            response
                              .status(customError.statusCode)
                              .json(customError);
                          } else {
                            response.status(result.statusCode).json(result);
                          }
                        });
                    } else {
                      response.status(result.statusCode).json(result);
                    }
                  }
                } else {
                  const result = httpResponse.UnauthorizedException(
                    "Error en la autenticacion al crear el usuario"
                  );
                  response.status(result.statusCode).json(result);
                }
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "Error al validar los campos de la empresa ",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  findImage = async (request: express.Request, response: express.Response) => {
    const idProject = Number(request.params.id);
    const result = await companyService.findIdImage(idProject);
    if (typeof result.payload === "string") {
      fs.readFile(result.payload);
      response.sendFile(result.payload);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  async updateStatus(request: express.Request, response: express.Response) {
    const idCompany = Number(request.params.id);
    const result = await companyService.updateStatusCompany(idCompany);
    response.status(result.statusCode).json(result);
  }

  async findByIdCompany(request: express.Request, response: express.Response) {
    const idCompany = Number(request.params.id);
    const result = await companyService.findById(idCompany);
    response.status(result.statusCode).json(result);
  }

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const name = request.query.name as string;
    const result = await companyService.searchByName(name, paginationOptions);
    response.status(result.statusCode).json(result);
  }

  async allCompanies(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await companyService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const companyController = new CompanyController();
