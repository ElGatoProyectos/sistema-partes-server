import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import { projectService } from "./proyecto.service";
import { companyMulterProperties } from "@/config/models/multer.constant";
import { Proyecto } from "@prisma/client";
import { T_ProyectoResponse } from "./models/proyecto.type";

//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer.memoryStorage();

class ProyectoController {
  private upload: any;
  constructor() {
    //es una instancia de muleter
    this.upload = multer({ storage: storage });
  }

  //[note] DEBE SER ASI SINO TE TOMA UPLOAD COMO UNDEFINED
  create = async (request: express.Request, response: express.Response) => {
    //se utiliza para manejar la subida de un solo archivo con el nombre de campo especificado
    //este método devuelve una función middleware
    //es una funcion q devuelve nuna funcion eso es por eso que puedes invocarla inmediatamente después de su creación.
    //entonces preparas a multer para que procese el archivo y luego ejecutas una funcion
    this.upload.single(companyMulterProperties.field)(
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
          const data = request.body;
          try {
            //
            //validar campos que vienen

            const result = await projectService.createProject(data);
            if (!result.success) {
              return result;
            }
            const project = result.payload as Proyecto;
            if (request.file) {
              console.log("entro a file");
              const id = project.id;
              const direction = path.join(
                appRootPath.path,
                "static",
                companyMulterProperties.folder
              );
              const ext = ".png";
              const fileName = `${companyMulterProperties.folder}_${id}${ext}`;
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
              "Error al validar los campos",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };
}

export const proyectoController = new ProyectoController();
