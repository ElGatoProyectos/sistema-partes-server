import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import fs from "fs/promises";
import { T_FindAll } from "@/common/models/pagination.types";
import { authService } from "@/auth/auth.service";
import { ProductionUnitMulterProperties } from "./models/production-unit.constant";
import { prouductionUnitDto } from "./dto/production-unit.dto";
import { productionUnitService } from "./production-unit.service";
import { UnidadProduccion } from "@prisma/client";
import { prouductionUnitUpdateDto } from "./dto/update-production-unit.dto";
import { I_UpdateProductionUnitBody } from "./models/production-unit.interface";

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
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              prouductionUnitDto.parse(request.body);
              const data = request.body;
              const result = await productionUnitService.createProductionUnit(
                data
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
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              " Error al validar los campos de la Unidad de Producción",
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
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              prouductionUnitUpdateDto.parse(request.body);
              const data = request.body as I_UpdateProductionUnitBody;
              const idProject = Number(request.params.id);
              const result = await productionUnitService.updateProductionUnit(
                data,
                idProject
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

  findImage = async (request: express.Request, response: express.Response) => {
    const idProject = Number(request.params.id);
    const result = await productionUnitService.findIdImage(idProject);
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
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const idCompany = request.params.id;
    const result = await productionUnitService.findAll(paginationOptions);
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
}

export const productionUnitController = new ProductionUnitController();
