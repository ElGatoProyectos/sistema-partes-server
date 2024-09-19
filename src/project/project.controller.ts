import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import { projectService } from "./project.service";
import { ProjectMulterProperties } from "@/project/models/project.constant";
import { Proyecto } from "@prisma/client";
import { proyectoDto } from "./dto/project.dto";
import fs from "fs/promises";
import { I_UpdateProyectBody } from "./models/project.interface";
import { proyectoDtoUpdate } from "./dto/proyectUpdate.dto";
import { T_FindAll } from "@/common/models/pagination.types";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { authService } from "@/auth/auth.service";

//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class ProjectController {
  //[note] DEBE SER ASI SINO TE TOMA UPLOAD COMO UNDEFINED
  create = async (
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) => {
    //se utiliza para manejar la subida de un solo archivo con el nombre de campo especificado
    //este método devuelve una función middleware
    //es una funcion q devuelve nuna funcion eso es por eso que puedes invocarla inmediatamente después de su creación.
    //entonces preparas a multer para que procese el archivo y luego ejecutas una funcion
    upload.single(ProjectMulterProperties.field)(
      request,
      response,
      //nextFunction,
      async (error: any) => {
        if (error) {
          const customError = httpResponse.BadRequestException(
            "Error al procesar la imagen ",
            error
          );
          response.status(customError.statusCode).json(customError);
        } else {
          try {
            // se hace asi y no desde la clase del middleware xq sino pierdo los valores del request cuando verifico
            //despues los valores
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              proyectoDto.parse(request.body);
              const tokenWithBearer = request.headers.authorization;
              const data = request.body;
              if (tokenWithBearer) {
                const result = await projectService.createProject(
                  data,
                  tokenWithBearer
                );
                //en controlador si hay if tiene q tener su else
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as Proyecto;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      ProjectMulterProperties.folder
                    );
                    const ext = ".png";
                    const fileName = `${ProjectMulterProperties.folder}_${id}${ext}`;
                    //se hace de nuevo el path.join xq cmbina el directorio y el nombre del archivo para obtener la ruta
                    //completa donde se guardará el archivo. Es mejor preparar la ruta antes x si el día de mañana cambias
                    //de carpeta donde van a guardar
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la imagen",
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
                  "Error en la autenticacion al crear el proyecto"
                );
                response.status(result.statusCode).json(result);
              }
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              " Error al validar los campos ",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  updateProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    upload.single(ProjectMulterProperties.field)(
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
            // se hace asi y no desde la clase del middleware xq sino pierdo los valores del request cuando verifico
            //despues los valores
            const responseValidate = authService.verifyRolProject(
              request.get("Authorization") as string
            );
            if (!responseValidate?.success) {
              return response.status(401).json(responseValidate);
            } else {
              proyectoDtoUpdate.parse(request.body);
              const tokenWithBearer = request.headers.authorization;
              const data = request.body as I_UpdateProyectBody;
              if (tokenWithBearer) {
                const idProject = Number(request.params.id);
                const result = await projectService.updateProject(
                  data,
                  idProject,
                  tokenWithBearer
                );
                if (!result.success) {
                  response.status(result.statusCode).json(result);
                } else {
                  const project = result.payload as Proyecto;
                  if (request.file) {
                    const id = project.id;
                    const direction = path.join(
                      appRootPath.path,
                      "static",
                      ProjectMulterProperties.folder
                    );
                    const ext = ".png";
                    const fileName = `${ProjectMulterProperties.folder}_${id}${ext}`;
                    //se hace de nuevo el path.join xq cmbina el directorio y el nombre del archivo para obtener la ruta
                    //completa donde se guardará el archivo. Es mejor preparar la ruta antes x si el día de mañana cambias
                    //de carpeta donde van a guardar
                    const filePath = path.join(direction, fileName);
                    sharp(request.file.buffer)
                      .resize({ width: 800 })
                      .toFormat("png")
                      .toFile(filePath, (err) => {
                        if (err) {
                          const customError = httpResponse.BadRequestException(
                            "Error al guardar la imagen",
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
              " Error al validar los campos ",
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
    const result = await projectService.findIdImage(idProject);
    if (typeof result.payload === "string") {
      fs.readFile(result.payload);
      response.sendFile(result.payload);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  findByIdProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    const idProject = request.params.id;
    const result = await projectService.findById(+idProject);
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
    //si buscaba como request.body no me llegaba bien para luego buscar
    const name = request.query.name as string;
    const result = await projectService.findByName(name, paginationOptions);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  };

  findAllProjectsXCompany = async (
    request: express.Request,
    response: express.Response
  ) => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const idCompany = request.params.id;
    const result = await projectService.findAllProjectsXCompany(
      +idCompany,
      paginationOptions
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  };
  async updateStatus(request: express.Request, response: express.Response) {
    const idProject = Number(request.params.id);
    const result = await projectService.updateStatusProject(idProject);
    response.status(result.statusCode).json(result);
  }
  async updateState(request: express.Request, response: express.Response) {
    const idProject = Number(request.params.id);
    const data = request.body;
    const result = await projectService.updateStateProject(idProject, data);
    response.status(result.statusCode).json(result);
  }
}

export const projectController = new ProjectController();
