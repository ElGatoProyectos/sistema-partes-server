import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import { projectService } from "./project.service";
import { ProjectMulterProperties } from "@/project/models/project.constant";
import { Proyecto } from "@prisma/client";
import { T_ProyectoResponse } from "./models/project.type";
import { proyectoDto } from "./dto/project.dto";
import fs from "fs/promises";
import { I_UpdateProyectBody } from "./models/project.interface";

//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class ProjectController {
  //[note] DEBE SER ASI SINO TE TOMA UPLOAD COMO UNDEFINED
  create = async (request: express.Request, response: express.Response) => {
    //se utiliza para manejar la subida de un solo archivo con el nombre de campo especificado
    //este método devuelve una función middleware
    //es una funcion q devuelve nuna funcion eso es por eso que puedes invocarla inmediatamente después de su creación.
    //entonces preparas a multer para que procese el archivo y luego ejecutas una funcion
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
            proyectoDto.parse(request.body);
            const data = request.body;
            const result = await projectService.createProject(data);
            if (!result.success) {
              return result;
            }
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
                    response.status(customError.statusCode).json(customError);
                  } else {
                    response.status(result.statusCode).json(result);
                  }
                });
            } else {
              response.status(result.statusCode).json(result);
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "[c] Error al validar los campos ",
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
          const data = request.body as I_UpdateProyectBody;
          try {
            const idProject = Number(request.params.id);
            const result = await projectService.updateProject(data, idProject);
            if (!result.success) {
              return result;
            }
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
                    response.status(customError.statusCode).json(customError);
                  } else {
                    response.status(result.statusCode).json(result);
                  }
                });
            } else {
              response.status(result.statusCode).json(result);
            }
          } catch (error) {
            const customError = httpResponse.BadRequestException(
              "[c] Error al validar los campos ",
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

  // updateIdProject = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {};

  findByIdProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    const idProject = request.params.id;
    const result = await projectService.findById(+idProject);
    response.status(result.statusCode).json(result);
  };

  findAllProjectsXUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    const idUser = request.params.id;
    const result = await projectService.findAllProjectsXUser(+idUser);
    response.status(result.statusCode).json(result);
  };
}

export const projectController = new ProjectController();
