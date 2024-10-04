import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import fs from "fs/promises";
import { T_FindAll } from "@/common/models/pagination.types";
import { authService } from "@/auth/auth.service";
import {
  ProductionUnitMulterFileProject,
  ProductionUnitMulterProperties,
} from "./models/production-unit.constant";
import { prouductionUnitDto } from "./dto/production-unit.dto";
import { productionUnitService } from "./production-unit.service";
import { Proyecto, UnidadProduccion } from "@prisma/client";
import { prouductionUnitUpdateDto } from "./dto/update-production-unit.dto";
import { I_UpdateProductionUnitBody } from "./models/production-unit.interface";
import validator from "validator";
import { T_FindAllUp } from "./models/up.types";
import { projectValidation } from "@/project/project.validation";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class ProductionUnitController {
  create = async (request: express.Request, response: express.Response) => {
    upload.single(ProductionUnitMulterProperties.field)(
      request,
      response,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen de la Unidad de Producción",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            const responseValidate =
              authService.verifyRolProjectUserAndAdminAndCostManager(
                request.get("Authorization") as string
              );
            const project_id = request.get("project-id") as string;
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              prouductionUnitDto.parse(request.body);
              if (!validator.isNumeric(project_id)) {
                const customError = httpResponse.BadRequestException(
                  "El id del projecto debe ser numérico",
                  error
                );
                response.status(customError.statusCode).json(customError);
              } else {
                const data = request.body;
                const result = await productionUnitService.createProductionUnit(
                  data,
                  +project_id
                );
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as UnidadProduccion;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      ProductionUnitMulterProperties.folder
                    );
                    const ext = ".png";
                    const fileName = `${ProductionUnitMulterProperties.folder}_${id}${ext}`;
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la imagen de la Unidad de Producción",
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
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "Error al validar los campos de la Unidad de Producción",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  update = async (request: express.Request, response: express.Response) => {
    upload.single(ProductionUnitMulterProperties.field)(
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
            const responseValidate =
              authService.verifyRolProjectUserAndAdminAndCostManager(
                request.get("Authorization") as string
              );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              prouductionUnitUpdateDto.parse(request.body);
              const data = request.body as I_UpdateProductionUnitBody;
              const production_unit_id = request.params.id;
              const project_id = request.get("project-id") as string;
              if (
                !validator.isNumeric(production_unit_id) ||
                !validator.isNumeric(project_id)
              ) {
                const customError = httpResponse.BadRequestException(
                  "Los id deben ser numéricos",
                  error
                );
                response.status(customError.statusCode).json(customError);
              } else {
                const result = await productionUnitService.updateProductionUnit(
                  data,
                  +production_unit_id,
                  +project_id
                );
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as UnidadProduccion;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      ProductionUnitMulterProperties.folder
                    );
                    const ext = ".png";
                    const fileName = `${ProductionUnitMulterProperties.folder}_${id}${ext}`;
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la imagen de la Unidad de Producción",
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
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "Error al validar los campos ",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  uploadImageForProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    upload.single(ProductionUnitMulterFileProject.field)(
      request,
      response,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen de la Unidad de Producción",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            const responseValidate =
              authService.verifyRolProjectAdminAndCostControlAndProjectManagerAndUser(
                request.get("Authorization") as string
              );
            const project_id = request.get("project-id") as string;
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              if (!validator.isNumeric(project_id)) {
                const customError = httpResponse.BadRequestException(
                  "El id del projecto debe ser numérico",
                  error
                );
                response.status(customError.statusCode).json(customError);
              } else {
                const result = await projectValidation.findById(+project_id);
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as Proyecto;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      ProductionUnitMulterFileProject.folder
                    );
                    const ext = ".png";
                    const fileName = `${"Project"}_${id}${ext}`;
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la imagen de la Sectorización del proyecto",
                            err
                          );
                          response
                            .status(customError.statusCode)
                            .json(customError);
                        } else {
                          const customError = httpResponse.SuccessResponse(
                            "Imagen de la sectorización guardada correctamente",
                            err
                          );
                          response
                            .status(customError.statusCode)
                            .json(customError);
                        }
                      });
                  } else {
                    response.status(result.statusCode).json(result);
                  }
                }
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "Error al validar los campos para guardar la imagen de la Sectorización del Proyecto",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  findImage = async (request: express.Request, response: express.Response) => {
    const productionUnit_id = Number(request.params.id);
    const result = await productionUnitService.findIdImage(productionUnit_id);
    if (typeof result.payload === "string") {
      fs.readFile(result.payload);
      response.sendFile(result.payload);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  findImageSectorizacionProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    const project_id = request.get("project-id") as string;
    const result = await productionUnitService.findIdImageSectorizacion(
      +project_id
    );
    if (typeof result.payload === "string") {
      fs.readFile(result.payload);
      response.sendFile(result.payload);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  findById = async (request: express.Request, response: express.Response) => {
    const idProject = request.params.id;
    const result = await productionUnitService.findById(+idProject);
    response.status(result.statusCode).json(result);
  };

  findByName = async (request: express.Request, response: express.Response) => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const name = request.query.name as string;
    const result = await productionUnitService.findByName(
      name,
      paginationOptions
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  findAll = async (request: express.Request, response: express.Response) => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllUp = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const idCompany = request.params.id;
    const result = await productionUnitService.findAll(
      paginationOptions,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  async updateStatus(request: express.Request, response: express.Response) {
    const idProject = Number(request.params.id);
    const result = await productionUnitService.updateStatusProject(idProject);
    response.status(result.statusCode).json(result);
  }

  productionUnitReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("production-unit-file")(
      request,
      response,
      async (err: any) => {
        if (err) {
          return response.status(500).json({ error: "Error uploading file" });
        }
        // const project_id = Number(request.params.project_id);
        const project_id = request.get("project-id") as string;
        const file = request.file;
        if (!file) {
          return response.status(400).json({ error: "No se subió archivo" });
        }

        try {
          const serviceResponse =
            await productionUnitService.registerProductionUnitMasive(
              file,
              +project_id
            );

          response.status(serviceResponse.statusCode).json(serviceResponse);
        } catch (error) {
          response.status(500).json(error);
        }
      }
    );
  };
}

export const productionUnitController = new ProductionUnitController();
